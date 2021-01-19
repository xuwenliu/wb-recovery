FROM nginx:latest
RUN mkdir app
WORKDIR /app
COPY ./dist/ /app
COPY ./default.conf /etc/nginx/conf.d/default.conf