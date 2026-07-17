FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-dev libzip-dev unzip \
    && docker-php-ext-install pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /backend

COPY . .

RUN composer install --no-interaction --prefer-dist

RUN sed -i 's/\r$//' docker/entrypoint.sh \
    && chmod +x docker/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
