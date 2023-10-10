FROM node:18-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app
COPY . .

# Build the player.
RUN npm install --prefix player
RUN npm run build --prefix player

# Build the server.
RUN npm install --prefix server
RUN npm run build --prefix server

# Copy the project files into the distribution bundle.
RUN cp -r server/dist dist
RUN cp player/dist/index.html dist/index.html
RUN cp player/dist/player.js dist/player.js

# Start the server
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
