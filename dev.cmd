@echo off
rem Startet den Next.js-Dev-Server mit der portablen Node.js-Installation im PATH.
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"
npm run dev
