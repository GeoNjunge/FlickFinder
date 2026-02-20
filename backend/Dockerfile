FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1)})"

FROM base AS development

USER root

RUN npm ci && npm cache clean --force

USER nodejs

CMD [ "npm", "run", "dev" ]


FROM base AS production

USER root

RUN npm ci && npm run build && npm cache clean --force

USER nodejs

CMD [ "node", "dist/index.js" ]
