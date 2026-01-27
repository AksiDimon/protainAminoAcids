import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const buttonStyles = {
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '99px',
  padding: '14px 22px',
  fontSize: '0.98rem',
  color: '#0b1d1d',
  background: 'linear-gradient(135deg, #FFD7A8 0%, #FFF1B6 45%, #B9FBC0 100%)',
  boxShadow: '0 10px 24px rgba(11, 29, 29, 0.18)',
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 16px 36px rgba(11, 29, 29, 0.25)',
    background:
      'linear-gradient(135deg, #FFC894 0%, #FFE9A0 45%, #A9F5B6 100%)',
  },
};

function App() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at top left, rgba(255, 237, 213, 0.9) 0%, rgba(255, 255, 255, 0.9) 55%), radial-gradient(circle at 90% 20%, rgba(186, 230, 253, 0.6) 0%, rgba(255, 255, 255, 0.2) 35%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(120px 120px at 15% 20%, rgba(253, 224, 71, 0.35), transparent 60%), radial-gradient(160px 160px at 85% 35%, rgba(34, 197, 94, 0.2), transparent 65%), radial-gradient(220px 220px at 30% 85%, rgba(56, 189, 248, 0.25), transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 1,
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 10 },
        }}
      >
        <Box sx={{ textAlign: 'left', maxWidth: 640, mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: '#0b1d1d', opacity: 0.6 }}
          >
            Proteins toolkit
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: '#0b1d1d',
              mt: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Быстрые переходы по инструментам
          </Typography>
          <Typography sx={{ color: '#0b1d1d', opacity: 0.7, mt: 1 }}>
            Выберите нужный раздел.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Button sx={buttonStyles} onClick={() => navigate('/amino-aligner')}>
            Amino Aligner
          </Button>
          <Button sx={buttonStyles} onClick={() => navigate('/form')}>
            Form
          </Button>
          <Button sx={buttonStyles} onClick={() => navigate('/useRef')}>
            UseRef
          </Button>
          <Button
            sx={buttonStyles}
            onClick={() => navigate('/saveYouTubeVideo')}
          >
            Save YouTube Video
          </Button>
          <Button sx={buttonStyles} onClick={() => navigate('/saveYandexDisc')}>
            Save Yandex Disc
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
