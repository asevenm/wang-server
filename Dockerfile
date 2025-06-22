FROM node:24-alpine
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3001
CMD ["node", "index.js"]
