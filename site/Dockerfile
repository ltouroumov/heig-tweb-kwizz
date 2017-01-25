FROM webdevops/php-apache-dev:debian-9

RUN wget -qO /usr/bin/composer https://getcomposer.org/installer && chmod +x /usr/bin/composer
RUN wget -qO /tmp/node.tar.xz https://nodejs.org/dist/v6.9.4/node-v6.9.4-linux-x64.tar.xz && \
    tar -x -C /usr/local --strip-components 1 -f /tmp/node.tar.xz

COPY 10-vhost.conf /opt/docker/etc/httpd/vhost.common.d/

RUN a2enmod proxy && a2enmod proxy_http && a2enmod proxy_wstunnel

WORKDIR /var/web

COPY *.json /var/web/
RUN composer --no-suggest --no-progress install
RUN npm install --silent

COPY twig-app /var/web/twig-app
COPY public /var/web/public

COPY webpack.config.js /var/web/
COPY ng2-app /var/web/ng2-app
RUN npm run build:prod