# EchoLink

EchoLink is a real-time chat application built with Laravel, Inertia.js, and React.

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and NPM
- MySQL or another database supported by Laravel
- Git

## Installation

1. Clone the repository:
```
git clone
cd EchoLink
```
2. Install PHP dependencies:
```
composer install
```
3. Install JavaScript dependencies:
```
npm install
```
4. Create a copy of the `.env.example` file and rename it to `.env`. Update the database configuration in the `.env` file.
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=echolink
DB_USERNAME=root
DB_PASSWORD=
```
5. Generate the application key:
```
php artisan key:generate
```
6. Configure your database in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=echolink
DB_USERNAME=root
DB_PASSWORD=
```
7. Run the database migrations:
```
php artisan migrate
```
8. Link storage:
```
php artisan storage:link
```
## Starting the Application

You can start all required services using the included batch file:

1. Run the `start-services.bat` file by double-clicking it or running it from the command line:
```
start-services.bat
```
This will start:
- Laravel development server
- Vite development server for frontend assets
- Laravel Reverb WebSocket server
- Laravel Queue 

The application will automatically open in your default browser at http://localhost:8000.

## Manual Startup

If you prefer to start services manually, open separate terminal windows and run:

1. Laravel development server:
```
php artisan serve
```
2. Vite development server for frontend assets:
```
npm run dev
```
3. Laravel Reverb WebSocket server:
```
php artisan reverb:serve
```
4. Laravel Queue :
```
php artisan queue:listen
```
Then visit http://localhost:8000 in your browser.

## Features

- Real-time messaging
- Group conversations
- File sharing
- User management
- Admin controls

## License

[MIT License](LICENSE)