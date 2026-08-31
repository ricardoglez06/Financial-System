@echo off
echo Starting Financial System...
echo.
echo Starting API server on port 3000...
start "API Server" cmd /k "cd /d %~dp0apps\api && set NODE_ENV=development && npx tsx src/server.ts"
timeout /t 5 /nobreak >nul
echo.
echo Starting Web server on port 5173...
start "Web Server" cmd /k "cd /d %~dp0apps\web && pnpm dev"
timeout /t 3 /nobreak >nul
echo.
echo Both servers are starting...
echo API: http://localhost:3000
echo Web: http://localhost:5173
echo.
echo Login with: demo@example.com / Demo1234!
pause
