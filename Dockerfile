FROM node:18-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app
COPY . .
RUN rm -rf player

# Build the server.
RUN npm install
RUN npx playwright install-deps chromium
RUN npm run build

RUN cp -r node_modules dist/node_modules


FROM node:18-bookworm-slim
WORKDIR /app

COPY --from=0 app/dist dist
# Start the server
EXPOSE 3000
CMD ["node", "dist/src/index.js"]
