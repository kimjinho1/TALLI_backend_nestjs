FROM node:18 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma

# Install Dockerize
# RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
#     && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

RUN npx prisma generate

EXPOSE 3000

# CMD dockerize -wait tcp://localhost:5434 -timeout 20s && npx prisma migrate dev --name init && npm run start:prod
# CMD dockerize -wait tcp://postgres:5432 -timeout 20s && npx prisma migrate deploy && npm run start:prod
# CMD npx prisma migrate deploy && npm run start:prod
# CMD npx prisma migrate dev --name init && npm run start:prod
# CMD npx prisma migrate deploy && npm run start:prod

CMD prisma migrate deploy && npm start