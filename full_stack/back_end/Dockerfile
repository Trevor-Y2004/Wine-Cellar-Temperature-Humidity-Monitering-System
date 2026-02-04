#Use Node.js 20 image as base image
FROM node:20-alpine

#set working directory inside the container
WORKDIR /usr/src/app

#a few npm libraries default to deveopment setting, so manually invoking "production" ensures production quality code
ENV NODE_ENV=production

#copy package.json and package-lock.json to the working directory
COPY package*.json ./

#install app dependencies
RUN npm install

#copy all other application files to working directory
COPY . .

#expose the listening port that the docker instance listens on
EXPOSE 3000

#start the app
CMD [ "node", "server/server.js"]
