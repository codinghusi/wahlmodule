# syntax=docker/dockerfile:1

FROM node:21-alpine

ENV DATABASE_URL "mysql://root:1234@database:3306/db"
WORKDIR /app

# For Prisma
RUN apk add openssl zlib libgcc gcompat

# For npm install
COPY package.json package.json
RUN npm install

# Get the rest
COPY . .
RUN npx prisma generate
RUN npm run build

COPY <<EOF ./run.sh
#!/bin/sh
cd /app
npx prisma db push
npm run update
npm run preview -- --host --port 5000
EOF

#RUN npx prisma db push
#RUN npm run update
#ENTRYPOINT ["npm", "run", "preview", "-- --port 5000"]

EXPOSE 5000

ENTRYPOINT ["sh", "/app/run.sh"]