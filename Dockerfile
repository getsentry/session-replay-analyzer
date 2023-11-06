FROM node:18-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app
COPY . .

# Build the server.
RUN rm -rf docs locust player
RUN npm ci
RUN npx playwright install --with-deps chromium
RUN npm run build
RUN npm run test-playwright

RUN cp -r node_modules dist/node_modules

# Start the server
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
