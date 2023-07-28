FROM node:latest
LABEL authors="lehongphong"

WORKDIR /app

RUN npm install -g pm2

COPY package*.json ./

RUN npm install --production --silent 

COPY . .

CMD ["npm", "run", "start"]

