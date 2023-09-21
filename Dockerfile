FROM harbor.yarustech.ru/development-irus/frontend/node:lts-alpine
ARG ENV

WORKDIR /app

COPY app ./

RUN yarn install
RUN yarn build:$ENV

RUN npm install serve -g

CMD ["serve", "-s", "output", "-p", "3000"]
