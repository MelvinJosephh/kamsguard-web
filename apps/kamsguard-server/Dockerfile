# Use Node.js base image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the application source code
COPY . .

# Expose the application port
EXPOSE 3200

# Start the application
CMD ["npm", "start"]