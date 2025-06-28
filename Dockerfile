FROM node

# 1. 设置工作目录
WORKDIR /app

# 2. 安装依赖
COPY package*.json ./
RUN yarn install

# 3. 复制项目文件
COPY . .

# 创建上传目录
RUN mkdir -p /app/uploads
RUN mkdir -p /app/logs

# 设置权限
RUN chmod 755 /app/uploads
RUN chmod 755 /app/logs

# 4. 构建 TypeScript -> JavaScript
RUN yarn run build



# 5. 启动服务（这里假设入口为 dist/main.js）
CMD ["node", "dist/main.js"]

