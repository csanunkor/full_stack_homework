FROM node:alpine3.19
WORKDIR /nodeapp
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
