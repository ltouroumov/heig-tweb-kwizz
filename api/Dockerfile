FROM webdevops/php-nginx:debian-9

RUN wget -O /usr/bin/composer https://getcomposer.org/installer
RUN chmod +x /usr/bin/composer

WORKDIR /var/web

COPY composer.* /var/web/
RUN composer install

COPY app /var/web/app
COPY public /var/web/public
COPY src /var/web/src