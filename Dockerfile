# Use Node.js official image to build the app
FROM node:16 AS build

# Set the working directory for your app
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Build the project using Vite
RUN npm run build

# Stage 2: Use Nginx to serve the build files
FROM nginx:alpine

# Copy the build output to the Nginx server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the web server\
EXPOSE 80

# Start Nginx\
CMD ["nginx", "-g", "daemon off;"]
