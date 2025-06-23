
import { createRoot } from 'react-dom/client'
import "@fontsource/roboto"; // подключает Roboto

import App from './App.tsx'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {mode: 'light'},
  typography: {fontFamily: 'Roboto, sans-serif'},
})
createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline/>
  <App />
  </ThemeProvider>
)
