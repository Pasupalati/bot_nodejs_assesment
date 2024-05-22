FROM node:20

# Create app directory
WORKDIR /app/src/app

COPY package.json ./


RUN npm install

COPY . .

EXPOSE 3434:3434
CMD [ "npm", "start" ]
