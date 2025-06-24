FROM node
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3001
CMD ["node", "dist/main.js"]
