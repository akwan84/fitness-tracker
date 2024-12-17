# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .
COPY .env ./

# Expose the port your app runs on
EXPOSE 3500

# Define the command to run your app
CMD ["npm", "run", "dev"]
