#!/bin/sh

set -eu

if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

mkdir -p database storage/framework/cache storage/framework/sessions storage/framework/views
touch database/database.sqlite
php artisan migrate --force

exec "$@"
