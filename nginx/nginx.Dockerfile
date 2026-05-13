FROM nginx:alpine3.17

COPY src/static/css/            /usr/share/nginx/html/static/css/
COPY src/static/js/             /usr/share/nginx/html/static/js/
COPY src/static/*.html          /usr/share/nginx/html/
COPY nginx/default.conf         /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

EXPOSE 80