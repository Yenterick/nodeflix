FROM node:lts

WORKDIR /server

COPY app.js .
COPY package.json .
COPY config ./config 
COPY controllers ./controllers
COPY middlewares ./middlewares
COPY models ./models
COPY routes ./routes
COPY utils ./utils

RUN npm install

EXPOSE 5000

CMD ["npm", "start"]