# Base image
FROM node:18.16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run database migrations
RUN npx prisma migrate deploy 

# Build the application
RUN npm run build

# Expose the application's port
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]