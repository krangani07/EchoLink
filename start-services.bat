@echo off
echo Starting EchoLink services...

:: Start Laravel server
start cmd /k "cd /d d:\LARAVEL_BACKUP_CHAT\EchoLink && php artisan serve"

:: Start npm development server
start cmd /k "cd /d d:\LARAVEL_BACKUP_CHAT\EchoLink && npm run dev"

:: Start Laravel Reverb WebSocket server
start cmd /k "cd /d d:\LARAVEL_BACKUP_CHAT\EchoLink && php artisan reverb:start --debug"

:: Start Laravel Queue Worker
start cmd /k "cd /d d:\LARAVEL_BACKUP_CHAT\EchoLink && php artisan queue:listen"

echo All services started!

:: Wait a few seconds for services to initialize
timeout /t 2 /nobreak

:: Open Chrome with the website
start chrome http://localhost:8000

echo Browser opened!