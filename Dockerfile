FROM node:20 as builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:14-alpine

WORKDIR /app
COPY package*.json ./
ENV PORT=4000
ENV NODE_ENV=Production
RUN npm install
COPY --from=builder /app/dist ./dist
EXPOSE ${PORT}

CMD ["npm", "run", "start"]