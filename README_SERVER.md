# 萃丽妍 (Cuilea) 服务器部署指南

本指南专为使用 **Termius** 远程管理服务器的用户设计，旨在简化 GitHub -> 服务器的同步流程。

## 1. 环境依赖 (如果您使用 Node.js)
确保您的服务器已安装：
- **Node.js**: v18+ (推荐 v20)
- **Nginx**: 用于反向代理 (端口 80 -> 3000)
- **PM2**: 进程管理工具 (`npm install -g pm2`)

## 2. 初始部署流程 (Termius)
在 Termius 中进入您的目录，执行以下操作：

```bash
# 1. 克隆代码 (仅限第一次)
git clone <您的仓库地址>
cd <项目目录>

# 2. 为脚本添加执行权限
chmod +x deploy.sh

# 3. 运行部署脚本
./deploy.sh
```

## 3. GitHub 联动优化
为了方便您修改代码后直接在服务器更新：
- 建议在服务器配置 **SSH Key** 并添加到您的 GitHub 账户，这样 `deploy.sh` 中的 `git pull` 就不需要输入账号密码。
- 只要您在本地修改并 `git push`，然后在 Termius 中运行 `./deploy.sh`，一切都会自动完成。

## 4. 与 PHP/Python 共存
- **PHP**: 您可以通过 Nginx 的不同 `location` 块来同时运行 PHP。例如，`/api-php/` 交给 PHP-FPM，而 `/` 交给这个 Node.js 应用。
- **Python**: 如果您有 Python 脚本需要处理数据，可以使用 Python 创建 API，并让 Node.js (Express) 在后端通过 `fetch` 调用 Python 的 API 端口。

## 5. 常见问题
- **404 错误**: 检查 Nginx 配置文件中是否设置了 `proxy_pass`。
- **构建慢**: 服务器内存如果小于 2GB，构建可能会变慢。脚本已开启 `frozen-lockfile` 优化安装速度。
