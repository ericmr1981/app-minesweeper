# 使用轻量级的 Nginx 镜像
FROM nginx:alpine

# 复制游戏文件到 Nginx 目录
COPY public/ /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# Nginx 会自动启动
CMD ["nginx", "-g", "daemon off;"]
