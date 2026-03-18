# 🚀 一键部署详细教程

## 方案：Render + Vercel（推荐，完全免费）

---

## 📋 部署前准备

### 1. 注册账号（5分钟）

你需要注册以下账号：

| 平台 | 用途 | 注册链接 |
|---|---|---|
| **GitHub** | 存放代码 | https://github.com/signup |
| **Render** | 部署后端 | https://render.com/ （用GitHub登录） |
| **Vercel** | 部署前端 | https://vercel.com/ （用GitHub登录） |
| **智谱AI** | AI生成内容 | https://open.bigmodel.cn/ （手机号注册） |

---

## 🔧 第一步：获取AI API密钥

### 智谱AI（推荐，国内可用）

1. 访问 https://open.bigmodel.cn/
2. 点击右上角 "注册"，用手机号注册
3. 登录后，点击右上角头像 → "API Keys"
4. 点击 "添加新的 API Key"
5. 输入名称（如：xhs-ai），点击确认
6. **复制生成的密钥**（以 `sk-` 开头），保存好！

> 💡 新用户免费送 100万 tokens，足够生成几千篇文章

---

## 📦 第二步：Fork代码仓库

### 方法A：直接Fork（推荐）

1. 访问项目仓库：https://github.com/你的用户名/xhs-ai-deploy
2. 点击右上角的 **"Fork"** 按钮
3. 等待Fork完成，代码就复制到你的账号下了

### 方法B：手动创建

1. 登录GitHub
2. 点击右上角 "+" → "New repository"
3. 仓库名：`xhs-ai-deploy`
4. 选择 "Public"
5. 点击 "Create repository"
6. 上传代码文件（drag & drop）

---

## ⚙️ 第三步：部署后端到Render

### 3.1 创建Blueprint

1. 登录 https://render.com/ （用GitHub账号）
2. 点击右上角 **"New +"** → **"Blueprint"**
3. 在列表中找到你Fork的仓库 `xhs-ai-deploy`
4. 点击 **"Connect"**

### 3.2 配置服务

1. Render会自动读取 `render.yaml` 文件
2. 你会看到服务名称：`xhs-ai-backend`
3. 点击 **"Apply"**
4. 等待部署完成（约2-3分钟）

### 3.3 设置环境变量

1. 部署完成后，点击服务名称进入详情
2. 点击左侧 **"Environment"** 标签
3. 点击 **"Add Environment Variable"**
4. 添加：
   - **Key**: `ZHIPU_API_KEY`
   - **Value**: 你的智谱AI密钥
5. 点击 **"Save Changes"**
6. 服务会自动重新部署

### 3.4 获取后端地址

1. 等待部署完成（状态变成 "Live"）
2. 点击页面上方的URL（如：`https://xhs-ai-backend-abc123.onrender.com`）
3. **复制这个地址**，后面要用！

> ⚠️ 注意：Render免费版会在15分钟无访问后休眠，首次访问可能需要等待30秒唤醒

---

## 🎨 第四步：部署前端到Vercel

### 4.1 导入项目

1. 登录 https://vercel.com/ （用GitHub账号）
2. 点击 **"Add New Project"**
3. 在列表中找到你的仓库 `xhs-ai-deploy`
4. 点击 **"Import"**

### 4.2 配置项目

1. **Framework Preset**: 选择 `Vite`
2. **Root Directory**: 输入 `frontend`
3. **Build Command**: 保持默认 `npm run build`
4. **Output Directory**: 保持默认 `dist`

### 4.3 设置环境变量

1. 展开 **"Environment Variables"**
2. 点击 **"Add"**
3. 添加：
   - **Name**: `VITE_API_URL`
   - **Value**: 你的Render后端地址（如：`https://xhs-ai-backend-abc123.onrender.com`）
4. 点击 **"Add"**

### 4.4 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约1-2分钟）
3. 部署成功后，点击 **"Visit"** 查看你的网站！

---

## ✅ 第五步：验证部署

### 检查后端

1. 浏览器访问你的后端地址
2. 应该看到：
```json
{
  "message": "AI小红书助手API服务运行中",
  "docs": "/docs",
  "version": "1.0.0"
}
```

### 检查前端

1. 访问你的Vercel地址
2. 应该看到登录页面
3. 尝试生成一篇内容测试

---

## 🔄 第六步：更新代码（可选）

如果你想修改代码：

1. 在GitHub上编辑代码
2. Render和Vercel会自动重新部署
3. 或者手动点击 "Redeploy"

---

## 🆘 常见问题排查

### 问题1：前端显示 "生成失败"

**排查步骤：**
1. 检查Render的环境变量 `ZHIPU_API_KEY` 是否设置
2. 查看Render的Logs（控制台 → 你的服务 → Logs）
3. 确认API Key有效（在智谱AI控制台测试）

### 问题2：前端无法连接后端

**排查步骤：**
1. 确认后端地址正确（访问应该看到JSON响应）
2. 检查Vercel的环境变量 `VITE_API_URL`
3. 重新部署前端（Vercel → 你的项目 → Redeploy）

### 问题3：数据丢失

**原因：** Render免费版使用临时存储

**解决方案：**
- 升级到Render付费版（$7/月）
- 或连接外部数据库（MongoDB Atlas免费版）

### 问题4：部署失败

**排查步骤：**
1. 检查代码是否有语法错误
2. 查看部署日志（Render/Vercel控制台）
3. 确认环境变量设置正确

---

## 📊 费用说明

| 服务 | 免费额度 | 超出后 |
|---|---|---|
| **Render** | 750小时/月 | $7/月 |
| **Vercel** | 100GB流量/月 | $20/月 |
| **智谱AI** | 100万tokens | 按量付费 |

> 💡 个人使用免费版完全够用！

---

## 🎉 完成！

你现在拥有了一个完整的AI小红书助手：
- ✅ 前端：https://你的项目.vercel.app
- ✅ 后端：https://xhs-ai-backend-xxx.onrender.com
- ✅ AI生成：使用智谱AI免费额度

开始创作你的第一篇小红书内容吧！
