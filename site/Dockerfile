FROM webdevops/php-nginx:debian-9

RUN wget -O /usr/bin/composer https://getcomposer.org/installer && chmod +x /usr/bin/composer

WORKDIR /var/web

COPY composer.* /var/web/
RUN composer install

COPY twig-app /var/web/twig-app
COPY public /var/web/public