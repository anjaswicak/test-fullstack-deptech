# Use PHP 8.2 with Apache
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www/html

# Copy existing application directory permissions
COPY --chown=www-data:www-data . /var/www/html

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Create Apache configuration
RUN echo '<VirtualHost *:80>' > /etc/apache2/sites-available/000-default.conf && \
    echo '    DocumentRoot /var/www/html/public' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    <Directory /var/www/html/public>' >> /etc/apache2/sites-available/000-default.conf && \
    echo '        AllowOverride All' >> /etc/apache2/sites-available/000-default.conf && \
    echo '        Require all granted' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    </Directory>' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    ErrorLog ${APACHE_LOG_DIR}/error.log' >> /etc/apache2/sites-available/000-default.conf && \
    echo '    CustomLog ${APACHE_LOG_DIR}/access.log combined' >> /etc/apache2/sites-available/000-default.conf && \
    echo '</VirtualHost>' >> /etc/apache2/sites-available/000-default.conf

# Create startup script
RUN echo '#!/bin/bash' > /usr/local/bin/start.sh && \
    echo 'cd /var/www/html' >> /usr/local/bin/start.sh && \
    echo '# Create .env file if it does not exist' >> /usr/local/bin/start.sh && \
    echo 'if [ ! -f .env ]; then' >> /usr/local/bin/start.sh && \
    echo '    cp .env.example .env' >> /usr/local/bin/start.sh && \
    echo '    echo "Created .env from .env.example"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo '# Wait for database to be ready' >> /usr/local/bin/start.sh && \
    echo 'echo "Waiting for database connection..."' >> /usr/local/bin/start.sh && \
    echo 'for i in {1..30}; do' >> /usr/local/bin/start.sh && \
    echo '    if nc -z ${DB_HOST:-mysql} ${DB_PORT:-3306}; then' >> /usr/local/bin/start.sh && \
    echo '        echo "Database is ready!"' >> /usr/local/bin/start.sh && \
    echo '        break' >> /usr/local/bin/start.sh && \
    echo '    fi' >> /usr/local/bin/start.sh && \
    echo '    echo "Waiting for database... attempt $i/30"' >> /usr/local/bin/start.sh && \
    echo '    sleep 2' >> /usr/local/bin/start.sh && \
    echo 'done' >> /usr/local/bin/start.sh && \
    echo '# Generate app key if not set' >> /usr/local/bin/start.sh && \
    echo 'php artisan key:generate --force' >> /usr/local/bin/start.sh && \
    echo '# Clear caches' >> /usr/local/bin/start.sh && \
    echo 'php artisan config:clear' >> /usr/local/bin/start.sh && \
    echo 'php artisan cache:clear' >> /usr/local/bin/start.sh && \
    echo '# Run migrations and seeders' >> /usr/local/bin/start.sh && \
    echo 'php artisan migrate --force' >> /usr/local/bin/start.sh && \
    echo 'php artisan db:seed --force' >> /usr/local/bin/start.sh && \
    echo '# Start Apache' >> /usr/local/bin/start.sh && \
    echo 'apache2-foreground' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["/usr/local/bin/start.sh"]