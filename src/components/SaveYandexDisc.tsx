import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { useCallback, useState } from 'react';

interface FileMeta {
  name: string;
  size: string;
  type: string;
  directUrl?: string;
  expiresAt?: string;
}

const validateYandexLink = (link: string) =>
  /(disk\.yandex\.[\w.]+|yadi\.sk)\//i.test(link.trim());

export function SaveYandexDisc() {
  const [publicLink, setPublicLink] = useState('');
  const [fileMeta, setFileMeta] = useState<FileMeta | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setFileMeta(null);

      if (!validateYandexLink(publicLink)) {
        setError('Введите корректную публичную ссылку на Яндекс.Диск.');
        return;
      }

      setIsFetching(true);
      // Здесь должен быть запрос на ваш backend, который получит прямую ссылку.
      // Пока используем заглушку.
      setTimeout(() => {
        setFileMeta({
          name: 'video_from_yandex.mp4',
          size: '58.4 MB',
          type: 'video/mp4',
          directUrl: publicLink,
          expiresAt: 'через 24 часа',
        });
        setIsFetching(false);
      }, 800);
    },
    [publicLink]
  );

  const handleDownload = useCallback(() => {
    if (!fileMeta?.directUrl) {
      setError('Прямая ссылка не получена. Попробуйте снова.');
      return;
    }
    setIsDownloading(true);
    try {
      const a = document.createElement('a');
      a.href = fileMeta.directUrl;
      a.download = fileMeta.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setIsDownloading(false);
    }
  }, [fileMeta]);

  return (
    <Box
      maxWidth="760px"
      margin="0 auto"
      padding={{ xs: 2, md: 4 }}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <CloudDoneIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Скачать видео с Яндекс.Диска
        </Typography>
      </Stack>

      <Card elevation={3}>
        <CardContent>
          <Stack
            component="form"
            onSubmit={handleFetch}
            spacing={2}
            alignItems="stretch"
          >
            <TextField
              label="Публичная ссылка"
              placeholder="https://disk.yandex.ru/d/..."
              value={publicLink}
              onChange={(e) => setPublicLink(e.target.value)}
              required
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              error={Boolean(error)}
              helperText={error ?? 'Вставьте публичную ссылку на файл в Яндекс.Диске'}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                disabled={isFetching}
                sx={{ minWidth: 180 }}
              >
                {isFetching ? 'Получаем данные...' : 'Получить ссылку'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setPublicLink('');
                  setFileMeta(null);
                  setError(null);
                }}
              >
                Сбросить
              </Button>
            </Stack>
          </Stack>
          {isFetching && <LinearProgress sx={{ mt: 2 }} />}
        </CardContent>
      </Card>

      {fileMeta && (
        <Card elevation={2}>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6">{fileMeta.name}</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label={fileMeta.size} />
                <Chip label={fileMeta.type} />
                {fileMeta.expiresAt && (
                  <Chip color="warning" label={`Ссылка действует: ${fileMeta.expiresAt}`} />
                )}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Нажмите «Скачать», чтобы начать загрузку. Если ссылка требует токена или
                приватного доступа, настройте это на сервере.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                disabled={isDownloading}
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                {isDownloading ? 'Скачиваем...' : 'Скачать'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {!fileMeta && (
        <Alert severity="info">
          Вставьте публичную ссылку на файл в Яндекс.Диске. Backend должен вернуть прямую
          ссылку для скачивания; сейчас используется демонстрационная заглушка.
        </Alert>
      )}
    </Box>
  );
}
