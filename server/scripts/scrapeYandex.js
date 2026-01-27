#!/usr/bin/env node
// Recursively scrape all videos from a public Yandex.Disk folder.
// Usage: node server/scripts/scrapeYandex.js "<public_url>" [outDir]

import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_BASE = 'https://cloud-api.yandex.net/v1/disk/public/resources';
const OUTPUT_ROOT = process.argv[3] || path.join(__dirname, '..', 'yadisk-downloads');
const publicUrl = process.argv[2];
const PROGRESS_FILE = path.join(OUTPUT_ROOT, 'download-progress.json');

if (!publicUrl) {
  console.error('Usage: node server/scripts/scrapeYandex.js "<public_url>" [outDir]');
  process.exit(1);
}

const safeName = (name) =>
  name
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'unnamed';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

const loadCheckpoint = async () => {
  try {
    const raw = await fs.promises.readFile(PROGRESS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.last || null;
  } catch {
    return null;
  }
};

const saveCheckpoint = async (pathStr) => {
  try {
    await fs.promises.mkdir(path.dirname(PROGRESS_FILE), { recursive: true });
    await fs.promises.writeFile(PROGRESS_FILE, JSON.stringify({ last: pathStr }), 'utf8');
  } catch (err) {
    console.warn('Failed to persist checkpoint', err);
  }
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function downloadFile(url, destPath, attempt = 1, maxAttempts = 3) {
  await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed ${res.status} for ${url}`);
  }
  const totalBytes = Number(res.headers.get('content-length')) || 0;
  let downloaded = 0;
  const startTime = Date.now();
  const spinnerFrames = ['|', '/', '-', '\\'];
  let spinnerIdx = 0;

  const nodeStream = Readable.fromWeb(res.body);
  const fileStream = fs.createWriteStream(destPath);
  await new Promise((resolve, reject) => {
    nodeStream.on('data', (chunk) => {
      downloaded += chunk.length;
      const now = Date.now();
      const elapsedSec = Math.max((now - startTime) / 1000, 0.001);
      const speed = formatBytes(downloaded / elapsedSec);
      const percent = totalBytes
        ? Math.min((downloaded / totalBytes) * 100, 100)
        : 0;
      const barLength = 20;
      const filled = Math.round((percent / 100) * barLength);
      const bar = `${'█'.repeat(filled)}${'░'.repeat(barLength - filled)}`;
      const spinner = spinnerFrames[spinnerIdx % spinnerFrames.length];
      spinnerIdx += 1;
      const progressLine = totalBytes
        ? `${spinner} [${bar}] ${percent.toFixed(1)}% ${speed}/s`
        : `${spinner} [${bar}] ${formatBytes(downloaded)} ${speed}/s`;
      process.stdout.write(`\r${progressLine}`);
    });
    nodeStream.pipe(fileStream);
    nodeStream.on('error', reject);
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
  process.stdout.write('\r✓ [████████████████████] 100% done           \n');
}

async function downloadWithRetry(url, destPath, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await downloadFile(url, destPath, attempt, maxAttempts);
      return;
    } catch (err) {
      const isRetryable =
        err.code === 'ECONNRESET' ||
        err.code === 'ETIMEDOUT' ||
        (err.message && err.message.includes('Request failed'));
      if (attempt < maxAttempts && isRetryable) {
        const backoff = 500 * attempt;
        console.warn(
          `Retry ${attempt}/${maxAttempts} for ${destPath} after error: ${err.code || err.message
          }`
        );
        await new Promise((r) => setTimeout(r, backoff));
        continue;
      }
      throw err;
    }
  }
}

async function walkFolder(publicKey, currentPath = '', state) {
  const url = new URL(API_BASE);
  url.searchParams.set('public_key', publicKey);
  url.searchParams.set('path', currentPath);
  url.searchParams.set('limit', '1000');

  const data = await fetchJson(url.toString());
  const embedded = data._embedded?.items || [];

  for (const item of embedded) {
    if (item.type === 'dir') {
      await walkFolder(publicKey, item.path, state);
      continue;
    }

    const lowerName = item.name?.toLowerCase() || '';
    const isVideo =
      item.media_type === 'video' ||
      (item.mime_type && item.mime_type.startsWith('video/'));
    const isDoc =
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.docx') ||
      item.mime_type === 'application/pdf' ||
      item.mime_type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isVideo && !isDoc) {
      continue;
    }

    // get download link
    const fileUrl = item.file;
    if (!fileUrl) {
      console.warn(`No direct file link for ${item.name}, skipping`);
      continue;
    }

    if (state.skipUntil && item.path !== state.skipUntil) {
      console.log(`Skipping (resuming): ${item.path}`);
      continue;
    }
    state.skipUntil = null;

    const relativePathParts = item.path.replace(/^disk:/, '').split('/');
    const targetDir = path.join(
      OUTPUT_ROOT,
      ...relativePathParts.slice(0, -1).map(safeName)
    );
    const targetName = safeName(item.name);
    const targetPath = path.join(targetDir, targetName);

    console.log(`Downloading: ${item.path} -> ${targetPath}`);
    await downloadWithRetry(fileUrl, targetPath);
    await saveCheckpoint(item.path);
  }
}

(async () => {
  try {
    console.log(`Starting scrape of ${publicUrl}`);
    const last = await loadCheckpoint();
    const state = { skipUntil: last };
    if (last) {
      console.log(`Resuming after checkpoint: ${last}`);
    }
    await walkFolder(publicUrl, '', state);
    console.log('Done.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
