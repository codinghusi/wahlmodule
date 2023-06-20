# Based on https://nodejs.org/en/docs/guides/nodejs-docker-webapp

FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Create database schema
RUN npx prisma db push

# Init database with content
RUN npm run update

# Build for production
RUN npm run build

EXPOSE 8080
CMD [ "npm", "run preview -- --host 0.0.0.0 --port 8080" ]