FROM node:18-bookworm-slim
FROM mcr.microsoft.com/playwright:focal

ENV NODE_ENV=production

WORKDIR /app
COPY . .

# Install deps
RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

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
