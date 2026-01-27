import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import TBankReactOptimization from './TBankReactOptimization';
import RefExplanetion from './useRefExplonation';
import { StarWarsFetch } from './components/StarWarsFetch';
import { SaveYouTubeVideo } from './components/SaveYouTubeVideo';
import { SaveYandexDisc } from './components/SaveYandexDisc';
import VideoPlayer from './useRefVideo';
const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        { index: true, element: <App /> },
        { path: 'form', element: <TBankReactOptimization /> },
        { path: 'useRef', element: <RefExplanetion /> },
        { path: 'starWarsFetch', element: <StarWarsFetch /> },
        { path: 'saveYouTubeVideo', element: <SaveYouTubeVideo /> },
        { path: 'saveYandexDisc', element: <SaveYandexDisc /> },
        { path: 'videoPlayerRef', element: <VideoPlayer /> },
      ],
    },
  ],
  { basename },
);
