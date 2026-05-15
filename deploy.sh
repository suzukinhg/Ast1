#!/bin/bash

# --- 萃丽妍 (Cuilea) 自动化部署脚本 ---

echo "🚀 开始部署更新..."

# 1. 从 GitHub 推送的最新的主分支拉取代码
echo "📥 正在从仓库拉取代码..."
git pull origin main

# 2. 安装前端依赖
echo "📦 正在安装依赖..."
npm install --frozen-lockfile

# 3. 执行生产环境构建
echo "🏗️ 正在构建项目 (Frontend + Backend)..."
npm run build || { echo "❌ 构建失败，请检查报错！"; exit 1; }

# 4. 进程管理 (强烈建议在服务器安装 pm2: npm install -g pm2)
if command -v pm2 &> /dev/null
then
    echo "🔄 检测到 PM2，正在重启服务..."
    # 如果是第一次运行，请手动执行一次: pm2 start dist/server.cjs --name "cuilea-app"
    pm2 restart cuilea-app || pm2 start dist/server.cjs --name "cuilea-app"
else
    echo "⚠️ 未检测到 PM2，建议安装以实现后台运行。"
    echo "💡 您可以手动运行: nohup node dist/server.cjs &"
fi

echo "✅ 部署完成！"
echo "🌐 您的网页已更新。产物存放在 ./dist 目录下。"
echo "💡 请确保您的 Nginx 根目录指向了该项目的 /dist 文件夹。"
