FROM node:18-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app
COPY player player
COPY server server

# Build the player.
RUN npm install --prefix player
RUN npm run build --prefix player

# Build the server.
RUN npm install --prefix server
RUN npm run build --prefix server

# Copy the project files into the distribution bundle.
RUN mkdir dist
RUN cp player/dist/index.html dist/index.html
RUN cp player/dist/player.js dist/player.js
RUN cp -r server/dist/src/ dist/src/


RUN cp -r server/node_modules dist/node_modules


FROM node:18-bookworm-slim
WORKDIR /app

COPY --from=0 app/dist dist
# Start the server
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
