# AI小红书助手 - 一键部署指南

## 🚀 部署方式（二选一）

### 方案A：Render一键部署（推荐，完全免费）

#### 第一步：Fork本仓库
1. 点击右上角的 "Fork" 按钮，把代码复制到你的GitHub账号

#### 第二步：部署后端到Render
1. 访问 https://render.com/ （用GitHub账号登录）
2. 点击 "New +" → "Blueprint"
3. 选择你fork的仓库
4. Render会自动读取 `render.yaml` 配置
5. 点击 "Apply"
6. 等待部署完成（约2-3分钟）
7. 记录你的后端地址：`https://xhs-ai-backend-xxxx.onrender.com`

#### 第三步：配置AI API Key
1. 在Render控制台，点击你的服务
2. 点击 "Environment" 标签
3. 添加环境变量：
   - `ZHIPU_API_KEY`: 你的智谱AI密钥（推荐，国内可用）
   - 或者 `OPENAI_API_KEY`: 你的OpenAI密钥

> 💡 **获取智谱AI密钥**：https://open.bigmodel.cn/ （注册即送100万免费tokens）

#### 第四步：部署前端到Vercel
1. 访问 https://vercel.com/ （用GitHub账号登录）
2. 点击 "Add New Project"
3. 选择你fork的仓库
4. 配置：
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击 "Environment Variables"
6. 添加：`VITE_API_URL` = `https://你的后端地址`
7. 点击 "Deploy"

#### 第五步：完成！
- 前端地址：`https://你的项目名.vercel.app`
- 后端地址：`https://xhs-ai-backend-xxxx.onrender.com`

---

### 方案B：本地Docker运行（适合测试）

#### 前提条件
- 安装 Docker Desktop：https://www.docker.com/products/docker-desktop/

#### 运行步骤

1. **克隆代码**
```bash
git clone https://github.com/你的用户名/xhs-ai-deploy.git
cd xhs-ai-deploy
```

2. **配置环境变量**
创建 `.env` 文件：
```bash
# 选择其中一个填写
ZHIPU_API_KEY=你的智谱AI密钥
# 或者
OPENAI_API_KEY=你的OpenAI密钥
```

3. **启动服务**
```bash
docker-compose up
```

4. **访问应用**
- 前端：http://localhost:5173
- 后端API：http://localhost:8000

---

## 📁 项目结构

```
xhs-ai-deploy/
├── backend/           # 后端API服务
│   ├── main.py       # 主程序
│   └── requirements.txt
├── frontend/          # 前端React应用
│   ├── src/          # 源代码
│   └── package.json
├── docker-compose.yml # Docker配置
├── render.yaml       # Render部署配置
└── README.md         # 本文件
```

---

## 🔧 常见问题

### Q: 部署后前端无法连接后端？
**A**: 检查以下几点：
1. 后端是否部署成功（访问 `https://你的后端地址/` 应该看到欢迎信息）
2. Vercel的环境变量 `VITE_API_URL` 是否设置正确
3. 重新部署前端（Vercel会自动重新构建）

### Q: AI生成内容失败？
**A**: 
1. 检查API Key是否正确设置
2. 查看Render的日志（Logs标签）
3. 智谱AI新用户有免费额度，用完需要充值

### Q: 数据会丢失吗？
**A**: Render免费版会在服务休眠后重置数据。如需持久化存储，建议：
1. 升级到付费版
2. 或连接外部数据库（如MongoDB Atlas免费版）

### Q: 如何更新代码？
**A**: 
1. 修改你的GitHub仓库代码
2. Render和Vercel会自动重新部署
3. 或者手动点击 "Redeploy"

---

## 💡 使用技巧

### 获取智谱AI密钥
1. 访问 https://open.bigmodel.cn/
2. 手机号注册
3. 点击右上角头像 → "API Keys"
4. 创建新Key并复制

### 自定义爆款数据
修改 `backend/main.py` 中的 `TRENDING_POSTS` 列表

### 修改AI生成提示词
修改 `backend/main.py` 中的 `generate_with_ai` 函数里的 `system` 消息

---

## 🆘 需要帮助？

1. 查看Render日志：控制台 → 你的服务 → Logs
2. 查看Vercel日志：控制台 → 你的项目 → Functions
3. 在GitHub Issues提问

---

## 📄 许可证

MIT License - 可自由使用和修改
