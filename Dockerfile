# Use a lightweight Node image
FROM node:20-alpine AS build

# Build the Frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Setup the Backend
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./server/
RUN npm install --prefix server
COPY server/ ./server/

# Move client build to server public folder if using integrated serving
# Or set up a separate process (here we keep them separate as typical)
# But for a simple deployment, we'll serve static files through Express.

# EXPOSE the port
EXPOSE 5000

# Start command
CMD ["npm", "start", "--prefix", "server"]
