import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LinkIcon from '@mui/icons-material/Link';
import SearchIcon from '@mui/icons-material/Search';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface FormatOption {
  formatId: string;
  resolution: string;
  fps?: number;
  ext: string;
  container?: string;
  vcodec?: string;
  acodec?: string;
  filesize?: number;
  hasAudio: boolean;
  note?: string;
}

interface VideoDetails {
  id: string;
  title: string;
  uploader: string;
  duration: number;
  thumbnail: string;
}

type RequestState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'downloading'
  | 'success'
  | 'error';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const pickDefaultFormatId = (formatList: FormatOption[]): string => {
  const mp4WithAudio = formatList.find(
    (format) => format.ext === 'mp4' && format.hasAudio
  );
  const mp4Any = formatList.find((format) => format.ext === 'mp4');
  return (
    mp4WithAudio?.formatId ?? mp4Any?.formatId ?? formatList[0]?.formatId ?? ''
  );
};

export function SaveYouTubeVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [formats, setFormats] = useState<FormatOption[]>([]);
  const [selectedFormatId, setSelectedFormatId] = useState<string>('');
  const [downloadMode, setDownloadMode] = useState<'video' | 'merged'>(
    'merged'
  );
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const isSearching = requestState === 'loading';
  const isDownloading = requestState === 'downloading';

  const canDownload = useMemo(
    () => Boolean(videoDetails) && Boolean(selectedFormatId),
    [selectedFormatId, videoDetails]
  );
  const selectedFormatMeta = useMemo(
    () =>
      formats.find((format) => format.formatId === selectedFormatId) ?? null,
    [formats, selectedFormatId]
  );
  const canDownloadVideoOnly = Boolean(
    selectedFormatMeta && !selectedFormatMeta.hasAudio
  );
  const downloadExtension = useMemo(() => {
    if (!selectedFormatMeta) {
      return downloadMode === 'merged' ? 'mp4' : 'mp4';
    }
    if (downloadMode === 'video') {
      return selectedFormatMeta.ext ?? 'mp4';
    }
    return 'mp4';
  }, [downloadMode, selectedFormatMeta]);

  const validateUrl = useCallback((url: string) => {
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/i;
    return pattern.test(url.trim());
  }, []);

  const fetchVideoInfo = useCallback(async (url: string) => {
    setRequestState('loading');
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) {
        throw new Error('Не удалось получить данные о видео.');
      }
      const payload = await response.json();
      setVideoDetails({
        id: payload.id,
        title: payload.title,
        uploader: payload.uploader,
        duration: payload.duration,
        thumbnail: payload.thumbnail,
      });
      const availableFormats: FormatOption[] = payload.formats ?? [];
      setFormats(availableFormats);
      const defaultFormatId = pickDefaultFormatId(availableFormats);
      setSelectedFormatId(defaultFormatId);
      const defaultFormat =
        availableFormats.find(
          (format: FormatOption) => format.formatId === defaultFormatId
        ) ?? null;
      setDownloadMode('merged');
      setRequestState('ready');
    } catch (fetchError) {
      console.error(fetchError);
      setFormats([]);
      setVideoDetails(null);
      setSelectedFormat('');
      setRequestState('error');
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Неизвестная ошибка при загрузке информации.'
      );
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!validateUrl(videoUrl)) {
        setError('Введите корректную ссылку на видео YouTube.');
        setVideoDetails(null);
        setRequestState('error');
        return;
      }
      fetchVideoInfo(videoUrl.trim());
    },
    [fetchVideoInfo, validateUrl, videoUrl]
  );

  const formatFileSize = (size?: number) => {
    if (!size) return '—';
    const mb = size / (1024 * 1024);
    if (mb < 1024) {
      return `${mb.toFixed(1)} МБ`;
    }
    return `${(mb / 1024).toFixed(2)} ГБ`;
  };

  const handleStartDownload = useCallback(async () => {
    if (!canDownload || !videoDetails || !selectedFormatId) {
      setError('Нужно выбрать формат и найти видео.');
      return;
    }
    setRequestState('downloading');
    setError(null);
    try {
      const safeTitle = videoDetails.title.replace(/[\\/:*?"<>|]+/g, '').trim();
      const response = await fetch(
        `${API_BASE_URL}/api/download?url=${encodeURIComponent(
          videoUrl
        )}&formatId=${encodeURIComponent(
          selectedFormatId
        )}&mode=${downloadMode}&formatExt=${
          selectedFormatMeta?.ext ?? ''
        }&vcodec=${encodeURIComponent(
          selectedFormatMeta?.vcodec ?? ''
        )}&fileName=${encodeURIComponent(safeTitle)}`
      );
      if (!response.ok) {
        throw new Error('Не удалось начать загрузку.');
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const downloadName = safeTitle ? safeTitle : 'youtube-video';
      link.download = `${downloadName}.${downloadExtension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      setRequestState('success');
    } catch (downloadError) {
      console.error(downloadError);
      setRequestState('error');
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Неизвестная ошибка при скачивании.'
      );
    }
  }, [
    canDownload,
    downloadExtension,
    selectedFormatId,
    selectedFormatMeta,
    videoDetails,
    videoUrl,
    downloadMode,
  ]);

  return (
    <Box
      maxWidth="720px"
      margin="0 auto"
      padding={4}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <Box sx={{ maxWidth: '20vh' }}>
        <Button
          variant="contained"
          startIcon={<ReplyAllIcon />}
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#f95726ff',
            '&:hover': { backgroundColor: '#e64a19' },
          }}
        >
          {' '}
          main Page
        </Button>
      </Box>

      <Typography variant="h4" component="h1" fontWeight={600}>
        Save YouTube Video
      </Typography>

      <Card elevation={3}>
        <CardContent>
          <Stack component="form" gap={2} onSubmit={handleSubmit} noValidate>
            <TextField
              label="Вставьте ссылку на YouTube"
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
              error={Boolean(error)}
              helperText={
                error ?? 'Поддерживаются ссылки youtube.com и youtu.be'
              }
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              disabled={isSearching}
            >
              {isSearching ? 'Поиск...' : 'Найти видео'}
            </Button>
          </Stack>
          {isSearching && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {videoDetails && (
        <Card elevation={2}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={3}>
              <Box
                component="img"
                src={videoDetails.thumbnail}
                alt={videoDetails.title}
                width={{ xs: '100%', sm: 220 }}
                height={124}
                borderRadius={2}
                sx={{ objectFit: 'cover' }}
              />
              <Stack spacing={1} flex={1}>
                <Typography variant="h6">{videoDetails.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Канал: {videoDetails.uploader}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Длительность: {Math.floor(videoDetails.duration / 60)} мин{' '}
                  {videoDetails.duration % 60} сек
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card elevation={2}>
        <CardContent>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Выберите качество</FormLabel>
            <RadioGroup
              value={selectedFormatId}
              onChange={(event) => {
                const nextFormat = formats.find(
                  (format) => format.formatId === event.target.value
                );
                setSelectedFormatId(event.target.value);
                if (nextFormat?.hasAudio) {
                  setDownloadMode('merged');
                }
              }}
            >
              {formats.map((quality) => (
                <FormControlLabel
                  key={quality.formatId}
                  value={quality.formatId}
                  control={<Radio />}
                  label={
                    <Stack width="100%">
                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight={600}>
                          {quality.resolution} · {quality.ext.toUpperCase()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {quality.hasAudio
                            ? 'Видео + Аудио'
                            : 'Требуется объединение с аудио'}{' '}
                          · {formatFileSize(quality.filesize)}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Кодек: {quality.vcodec ?? '—'} · контейнер:{' '}
                        {(quality.container ?? quality.ext).toUpperCase()}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Способ скачивания</FormLabel>
            <RadioGroup
              row
              value={downloadMode}
              onChange={(event) => {
                const nextMode = event.target.value as 'video' | 'merged';
                if (nextMode === 'video' && !canDownloadVideoOnly) {
                  return;
                }
                setDownloadMode(nextMode);
              }}
            >
              <FormControlLabel
                value="video"
                control={<Radio />}
                label="Только видео (без звука)"
                disabled={!canDownloadVideoOnly}
              />
              <FormControlLabel
                value="merged"
                control={<Radio />}
                label="Видео + аудио"
              />
            </RadioGroup>
            {!canDownloadVideoOnly && (
              <Typography variant="body2" color="text.secondary">
                Для выбранного качества уже есть звук. Скачивание без звука
                недоступно.
              </Typography>
            )}
          </FormControl>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
            startIcon={<DownloadIcon />}
            onClick={handleStartDownload}
            disabled={!canDownload || isDownloading}
          >
            {isDownloading ? 'Загрузка...' : 'Скачать видео'}
          </Button>
        </CardContent>
      </Card>

      {requestState === 'success' && (
        <Alert severity="success">
          Видео успешно подготовлено. Сохранение файла начнётся автоматически.
        </Alert>
      )}
      {requestState === 'error' && error && (
        <Alert severity="error">{error}</Alert>
      )}
    </Box>
  );
}
