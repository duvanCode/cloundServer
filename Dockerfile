FROM node:21 as bot
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
ARG RAILWAY_STATIC_URL
ARG PUBLIC_URL
ARG PORT
CMD ["node", "app.js"]
