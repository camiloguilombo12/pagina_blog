FROM nginx:latest

RUN rm -rf /usr/share/nginx/html/*

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod -R o+rX /usr/share/nginx/html

EXPOSE 80