@echo off
cd /d "%~dp0"
title CDUT-Studio Dev

where bun >nul 2>nul
if errorlevel 1 (
  echo [ERROR] bun not found in PATH. Please install Bun first.
  pause
  exit /b 1
)

echo Starting CDUT-Studio (bun run dev)...
bun run dev
if errorlevel 1 (
  echo.
  echo [ERROR] Exited with code %errorlevel%
  pause
  exit /b %errorlevel%
)
