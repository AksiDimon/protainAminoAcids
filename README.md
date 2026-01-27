# React + TypeScript + Vite

## Getting Started

### 1. Pull latest changes

Clone once, then keep the workspace up to date:

```bash
git clone https://github.com/<username>/protainAminoAcids.git
cd protainAminoAcids
git pull origin master
```

If репозиторий уже склонирован, достаточно выполнить `git pull origin master` внутри корня проекта.

### 2. Run backend server for YouTube

```bash
cd server
npm install        # один раз
npm start          # запускает Express + yt-dlp прокси (порт 4000)
```

### 3. Run frontend

В отдельном терминале:

```bash
cd protainAminoAcids
npm install        # один раз
npm run dev        # Vite dev server на http://localhost:5173
```

Фронтенд ожидает, что backend доступен на `http://localhost:4000`. Остановить процессы можно `Ctrl+C` в каждой вкладке терминала.
