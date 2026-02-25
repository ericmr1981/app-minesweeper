# 💣 扫雷游戏 - Minesweeper

经典的扫雷游戏网页版，使用 HTML5、CSS3 和 JavaScript 开发，支持 Docker 容器化部署。

## 🎮 游戏说明

- **左键点击** - 揭开方块
- **右键点击** - 标记/取消标记地雷
- **数字** - 周围 8 格的地雷数量
- **目标** - 找出所有非地雷方块

## 🎯 难度级别

| 难度 | 格子大小 | 地雷数量 |
|------|----------|----------|
| 简单 | 9×9 | 10 个 |
| 中等 | 16×16 | 40 个 |
| 困难 | 16×30 | 99 个 |

## 🚀 本地运行

### 使用 Docker（推荐）

```bash
# 构建并运行
docker-compose up -d

# 访问游戏
open http://localhost:8081

# 停止服务
docker-compose down
```

### 直接运行

```bash
# 使用任意 Web 服务器
python3 -m http.server 8080 -d public

# 访问游戏
open http://localhost:8080
```

## 📦 部署到服务器

### 1. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

- `VPS_HOST` - VPS IP 地址
- `VPS_USERNAME` - SSH 用户名
- `VPS_PORT` - SSH 端口（默认 22）
- `VPS_SSH_KEY` - SSH 私钥
- `DOCKER_USERNAME` - Docker Hub 用户名
- `DOCKER_PASSWORD` - Docker Hub 密码/Token

### 2. 自动部署

推送到 main 分支后，GitHub Actions 会自动：
1. 构建 Docker 镜像
2. 推送到 Docker Hub
3. 部署到 VPS
4. 启动容器

### 3. 手动部署

```bash
# 在 VPS 上
docker pull <your-dockerhub-username>/app-minesweeper:latest
docker stop minesweeper 2>/dev/null || true
docker rm minesweeper 2>/dev/null || true
docker run -d --name minesweeper --restart unless-stopped -p 8081:80 <your-dockerhub-username>/app-minesweeper:latest
```

## 📁 项目结构

```
app-minesweeper/
├── public/
│   ├── index.html      # 主页面
│   ├── style.css       # 样式文件
│   └── game.js         # 游戏逻辑
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 配置
├── Dockerfile          # Docker 镜像配置
├── docker-compose.yml  # Docker Compose 配置
├── .gitignore          # Git 忽略文件
└── README.md           # 项目说明
```

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **服务器**: Nginx (Alpine)
- **容器化**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## 🌐 在线访问

部署后可通过 `http://你的 VPS-IP:8081` 访问游戏。

## 📝 开发日志

- **2026-02-25**: 初始版本发布
  - 经典扫雷玩法
  - 三种难度选择
  - 计时器和地雷计数
  - 响应式设计
  - Docker 容器化

## 🎨 游戏截图

游戏采用现代化渐变设计，支持响应式布局，在手机和电脑上都能完美运行。

## 📄 License

MIT License

---

**祝你游戏愉快！** 🎮
