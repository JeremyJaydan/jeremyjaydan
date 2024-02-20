FROM node:20-alpine

ENV APP_HOME /home/jeremy

WORKDIR $APP_HOME
COPY . .

ARG DOT_ENV
RUN echo $DOT_ENV | base64 -d >> .env
RUN echo "BASE64_DATE_STRING=$(date | base64)" >> .env

RUN npm i && npm run build
CMD npm run start