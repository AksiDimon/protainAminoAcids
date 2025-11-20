import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import youtubeDl from 'youtube-dl-exec';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = process.env.PORT || 4000;
const DEFAULT_BINARY_PATH = '/opt/homebrew/bin/yt-dlp';
const customBinary = process.env.YTDLP_BINARY?.trim();
const binaryPath =
  (customBinary && fs.existsSync(customBinary) && customBinary) ||
  (fs.existsSync(DEFAULT_BINARY_PATH) ? DEFAULT_BINARY_PATH : null);
const ytdlp = binaryPath ? youtubeDl.create(binaryPath) : youtubeDl;

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));

const validateUrl = (url) => {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  const ampIndex = trimmed.indexOf('&');
  return ampIndex >= 0 ? trimmed.slice(0, ampIndex) : trimmed;
  // return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(\S*)?$/i.test(
  //   trimmed
  // );
};

app.get('/api/info', async (req, res) => {
  console.log(res, '😀');
  const safeUrl = validateUrl(req.query.url);
  if (!safeUrl) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const videoInfo = await ytdlp(
      safeUrl,
      {
        dumpSingleJson: true,
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      },
      { shell: true }
    );

    const formats = (videoInfo.formats || [])
      .filter(
        (format) =>
          format.filesize || format.filesizeApprox || format.vcodec !== 'none'
      )
      .filter((format) => format.vcodec !== 'none')
      .map((format) => {
        const hasAudio = format.acodec !== 'none';
        return {
          formatId: format.format_id,
          resolution:
            format.resolution || (format.height ? `${format.height}p` : 'N/A'),
          fps: format.fps,
          ext: format.ext,
          container: format.container || format.ext,
          vcodec: format.vcodec,
          acodec: format.acodec,
          filesize: format.filesize || format.filesizeApprox,
          hasAudio,
          note: format.format_note,
        };
      });

    res.json({
      id: videoInfo.id,
      title: videoInfo.title,
      uploader: videoInfo.uploader,
      duration: videoInfo.duration,
      thumbnail: videoInfo.thumbnail,
      formats,
    });
  } catch (error) {
    console.error('yt-dlp info error', error);
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

app.get('/api/download', async (req, res) => {
  const { url, formatId, mode, formatExt, vcodec, fileName } = req.query;
  const safeUrl = validateUrl(url);
  if (!safeUrl || !formatId) {
    return res.status(400).json({ error: 'Missing url or formatId parameter' });
  }
  const sanitizedName =
    typeof fileName === 'string' && fileName.trim()
      ? fileName.replace(/[\\/:*?"<>|]+/g, '').trim()
      : 'youtube-video';

  try {
    const downloadMode = mode === 'video' ? 'video' : 'merged';
    const normalizedExt =
      typeof formatExt === 'string' ? formatExt.toLowerCase() : '';
    const normalizedCodec =
      typeof vcodec === 'string' ? vcodec.toLowerCase() : '';
    const isMp4Friendly =
      normalizedExt === 'mp4' ||
      normalizedExt === 'm4v' ||
      normalizedCodec.includes('avc') ||
      normalizedCodec.includes('h264');
    const audioSelector = 'bestaudio[ext=m4a]/bestaudio[acodec*=aac]/bestaudio';
    const requestedFormat =
      downloadMode === 'merged' ? `${formatId}+${audioSelector}` : formatId;
    const targetExt =
      downloadMode === 'merged' ? 'mp4' : normalizedExt || 'mp4';

    console.log({
      url,
      formatId,
      mode: downloadMode,
      requestedFormat,
      targetExt,
      audioSelector,
    });

    if (downloadMode === 'merged') {
      const tmpDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'save-yt-')
      );
      const tmpFile = path.join(tmpDir, `merged-${Date.now()}.${targetExt}`);
      const downloadProcess = ytdlp.exec(
        safeUrl,
        {
          f: requestedFormat,
          o: tmpFile,
          noCheckCertificates: true,
          noWarnings: true,
          preferFreeFormats: true,
          addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
          mergeOutputFormat: targetExt,
          recodeVideo: 'mp4',
        },
        { shell: false }
      );

      await new Promise((resolve, reject) => {
        downloadProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`yt-dlp exited with code ${code}`));
          }
        });
        downloadProcess.on('error', reject);
      });

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${sanitizedName}.mp4"`
      );

      const cleanup = async () => {
        try {
          await fs.promises.rm(tmpDir, { recursive: true, force: true });
        } catch (cleanupErr) {
          console.error('cleanup error', cleanupErr);
        }
      };

      const readStream = fs.createReadStream(tmpFile);
      readStream.on('error', async (streamErr) => {
        console.error('stream error', streamErr);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream video' });
        } else {
          res.end();
        }
        await cleanup();
      });
      res.on('close', cleanup);
      res.on('finish', cleanup);
      readStream.pipe(res);
      return;
    }

    res.setHeader(
      'Content-Type',
      `video/${targetExt === 'mp4' ? 'mp4' : 'webm'}`
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sanitizedName}.${targetExt}"`
    );

    const downloadProcess = ytdlp.exec(
      safeUrl,
      {
        f: requestedFormat,
        o: '-',
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
      },
      { stdio: ['ignore', 'pipe', 'pipe'], shell: false }
    );

    if (!downloadProcess.stdout) {
      throw new Error('Download process has no stdout stream');
    }

    downloadProcess.stdout.pipe(res);
    downloadProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`yt-dlp exited with code ${code}`);
        if (!res.headersSent) {
          res
            .status(500)
            .json({ error: 'Download failed. Please try another format.' });
        } else {
          res.end();
        }
      }
    });
    downloadProcess.stderr?.on('data', (chunk) =>
      console.log('[yt-dlp]', chunk.toString())
    );
    downloadProcess.on('error', (processError) => {
      console.error('yt-dlp download error', processError);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download video' });
      } else {
        res.end();
      }
    });
  } catch (error) {
    console.error('download endpoint error', error);
    res.status(500).json({ error: 'Failed to start download' });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube proxy server running on http://localhost:${PORT}`);
});
