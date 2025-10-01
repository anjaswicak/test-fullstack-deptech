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

# Install PHP dependencies (include dev dependencies for seeders)
RUN composer install --optimize-autoloader

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
    echo '    cp .env.docker .env' >> /usr/local/bin/start.sh && \
    echo '    echo "Created .env from .env.docker"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo '# Ensure APP_KEY exists in .env' >> /usr/local/bin/start.sh && \
    echo 'if ! grep -q "^APP_KEY=" .env; then' >> /usr/local/bin/start.sh && \
    echo '    echo "APP_KEY=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "Added APP_KEY to .env"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo '# Add comprehensive SSL configuration to .env if not present' >> /usr/local/bin/start.sh && \
    echo 'if ! grep -q "MYSQL_ATTR_SSL_VERIFY_SERVER_CERT" .env; then' >> /usr/local/bin/start.sh && \
    echo '    echo "" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "# MySQL SSL Configuration - Disable all SSL verification" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_VERIFY_SERVER_CERT=false" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_CA=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_CAPATH=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_CERT=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_CIPHER=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "MYSQL_ATTR_SSL_KEY=" >> .env' >> /usr/local/bin/start.sh && \
    echo '    echo "DB_SSLMODE=disable" >> .env' >> /usr/local/bin/start.sh && \
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
    echo 'APP_KEY_VALUE=$(grep "^APP_KEY=" .env | cut -d"=" -f2)' >> /usr/local/bin/start.sh && \
    echo 'if [ -z "$APP_KEY_VALUE" ] || [ "$APP_KEY_VALUE" = "" ]; then' >> /usr/local/bin/start.sh && \
    echo '    echo "Generating application key..."' >> /usr/local/bin/start.sh && \
    echo '    if php artisan key:generate --force --show > /tmp/app_key 2>/dev/null; then' >> /usr/local/bin/start.sh && \
    echo '        NEW_KEY=$(cat /tmp/app_key)' >> /usr/local/bin/start.sh && \
    echo '        sed -i "s/^APP_KEY=.*/APP_KEY=$NEW_KEY/" .env' >> /usr/local/bin/start.sh && \
    echo '        echo "Application key generated successfully"' >> /usr/local/bin/start.sh && \
    echo '        rm -f /tmp/app_key' >> /usr/local/bin/start.sh && \
    echo '    else' >> /usr/local/bin/start.sh && \
    echo '        echo "Using manual key generation..."' >> /usr/local/bin/start.sh && \
    echo '        MANUAL_KEY="base64:$(openssl rand -base64 32)"' >> /usr/local/bin/start.sh && \
    echo '        sed -i "s/^APP_KEY=.*/APP_KEY=$MANUAL_KEY/" .env' >> /usr/local/bin/start.sh && \
    echo '        echo "Manual application key set"' >> /usr/local/bin/start.sh && \
    echo '    fi' >> /usr/local/bin/start.sh && \
    echo 'else' >> /usr/local/bin/start.sh && \
    echo '    echo "Application key already set"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo '# Clear caches' >> /usr/local/bin/start.sh && \
    echo 'php artisan config:clear' >> /usr/local/bin/start.sh && \
    echo 'php artisan cache:clear' >> /usr/local/bin/start.sh && \
    echo '# Set MySQL SSL environment variables for all database operations' >> /usr/local/bin/start.sh && \
    echo 'export MYSQL_OPT_SSL_VERIFY_SERVER_CERT=0' >> /usr/local/bin/start.sh && \
    echo 'export MYSQL_OPT_SSL_MODE=DISABLED' >> /usr/local/bin/start.sh && \
    echo '# Create MySQL options file to disable SSL' >> /usr/local/bin/start.sh && \
    echo 'echo "[client]" > ~/.my.cnf' >> /usr/local/bin/start.sh && \
    echo 'echo "ssl=0" >> ~/.my.cnf' >> /usr/local/bin/start.sh && \
    echo '# Run migrations and seeders with error handling' >> /usr/local/bin/start.sh && \
    echo 'echo "Running database migrations..."' >> /usr/local/bin/start.sh && \
    echo 'if ! php artisan migrate --force --no-interaction; then' >> /usr/local/bin/start.sh && \
    echo '    echo "Migration failed, trying to run individual migrations..."' >> /usr/local/bin/start.sh && \
    echo '    php artisan migrate:fresh --force --no-interaction || echo "Migration still failed, continuing..."' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'echo "Running database seeders..."' >> /usr/local/bin/start.sh && \
    echo 'php artisan db:seed --force --no-interaction || echo "Seeding failed, continuing..."' >> /usr/local/bin/start.sh && \
    echo '# Start Apache' >> /usr/local/bin/start.sh && \
    echo 'apache2-foreground' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["/usr/local/bin/start.sh"]