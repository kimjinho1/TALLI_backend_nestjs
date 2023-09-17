# Use the official Node.js LTS image as the base image
FROM node:18.16

# Set the working directory
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

RUN npx prisma migrate deploy 

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]