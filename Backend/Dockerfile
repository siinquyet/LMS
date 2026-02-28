FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN rm -rf node_modules && npm ci --only=production --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["npm", "start"]
