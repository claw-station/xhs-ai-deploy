# 🚀 AI小红书助手 - 半自动部署指南

> 部署完成后，你将拥有一个完整的AI小红书内容生成系统！

---

## 📋 部署概览

| 组件 | 平台 | 用途 | 预计时间 |
|:---|:---|:---|:---|
| 后端API | Render | AI生成服务 | 3分钟 |
| 前端界面 | Vercel | 用户操作界面 | 2分钟 |

---

## 🔧 第一步：部署后端到 Render

### 1.1 注册/登录 Render

1. 访问 https://render.com/
2. 点击 "Get Started for Free"
3. 选择 "Continue with GitHub"
4. 授权登录

### 1.2 创建 Blueprint（一键部署）

1. 登录后，点击右上角 **"New +"**
2. 选择 **"Blueprint"**
3. 如果提示连接仓库，选择 **"Public Git Repository"**
4. 输入仓库地址：
   ```
   https://github.com/你的用户名/xhs-ai-deploy
   ```
   > 如果没有GitHub仓库，选择 "Upload a blueprint file"

### 1.3 上传 Blueprint 文件

1. 下载本文件夹中的 `render.yaml`
2. 在 Render 页面点击 **"Upload a blueprint file"**
3. 选择 `render.yaml` 上传
4. 点击 **"Apply"**

### 1.4 等待部署完成

- 部署过程约 2-3 分钟
- 看到状态变成 **"Live"** 表示成功
- **复制你的后端地址**（如：`https://xhs-ai-backend-xxx.onrender.com`）

### 1.5 验证后端

浏览器访问你的后端地址，应该看到：
```json
{
  "message": "AI小红书助手API服务运行中",
  "docs": "/docs",
  "version": "1.0.0"
}
```

✅ **后端部署完成！**

---

## 🎨 第二步：部署前端到 Vercel

### 2.1 注册/登录 Vercel

1. 访问 https://vercel.com/
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"

### 2.2 创建新项目

1. 登录后，点击 **"Add New Project"**
2. 如果提示导入仓库，选择 **"Import Git Repository"**
3. 或者点击 **"Upload"** 上传文件夹

### 2.3 配置项目

1. **Framework Preset**: 选择 `Vite`
2. **Root Directory**: 输入 `frontend`
3. **Build Command**: 保持默认 `npm run build`
4. **Output Directory**: 保持默认 `dist`

### 2.4 设置环境变量（重要！）

1. 展开 **"Environment Variables"** 部分
2. 点击 **"Add"** 添加变量：
   - **Name**: `VITE_API_URL`
   - **Value**: 你的后端地址（如：`https://xhs-ai-backend-xxx.onrender.com`）
3. 点击 **"Add"**

### 2.5 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 1-2 分钟）
3. 点击 **"Visit"** 查看你的网站！

✅ **前端部署完成！**

---

## ✅ 第三步：验证完整功能

### 3.1 访问你的前端地址

- 地址格式：`https://你的项目名.vercel.app`

### 3.2 测试 AI 生成功能

1. 点击 **"内容创作"**
2. 输入需求描述，如：
   ```
   我想写一篇关于夏日防晒的小红书笔记，目标受众是18-25岁的女大学生
   ```
3. 选择标签：**美妆护肤**
4. 点击 **"开始AI分析"**
5. 选择 1-3 篇爆款参考
6. 点击 **"生成内容"**
7. 等待 AI 生成...

### 3.3 预期结果

- ✅ 看到 "正在生成内容..." 动画
- ✅ 生成成功，显示标题和内容
- ✅ 可以编辑和预览
- ✅ 可以保存到草稿箱

---

## 🆘 常见问题

### 问题1：AI生成失败

**原因**：后端服务休眠了（Render免费版15分钟无访问会休眠）

**解决**：
1. 访问后端地址唤醒服务（等待30秒）
2. 刷新前端页面重试

### 问题2：前端无法连接后端

**检查**：
1. Vercel 的环境变量 `VITE_API_URL` 是否设置正确
2. 后端地址是否以 `https://` 开头
3. 重新部署前端（Vercel → 项目 → Redeploy）

### 问题3：部署失败

**检查**：
1. Render 的 Logs 查看错误信息
2. Vercel 的 Build Logs 查看构建错误
3. 确认代码文件完整上传

---

## 📁 文件说明

```
xhs-ai-deploy/
├── backend/
│   ├── main.py              # 后端主程序（已配置好API Key）
│   ├── requirements.txt     # Python依赖
│   └── render.yaml          # Render部署配置
├── frontend/
│   ├── src/                 # 前端源代码
│   ├── .env.production      # 生产环境配置（需要修改API地址）
│   └── package.json         # Node依赖
└── DEPLOY_GUIDE.md          # 本文件
```

---

## 🎉 部署成功！

你现在拥有：
- ✅ **前端界面**：`https://xxx.vercel.app`
- ✅ **后端API**：`https://xxx.onrender.com`
- ✅ **AI生成**：使用智谱AI，免费额度充足

**开始创作你的第一篇小红书爆款内容吧！** 🚀

---

## 💡 后续优化（可选）

| 优化项 | 说明 | 优先级 |
|:---|:---|:---|
| 自定义域名 | Vercel/Render都支持绑定自己的域名 | ⭐⭐ |
| 数据持久化 | 连接MongoDB等数据库，数据不会丢失 | ⭐⭐⭐ |
| 用户系统 | 添加登录功能，多用户隔离 | ⭐⭐ |
| 图片上传 | 接入云存储（阿里云OSS等） | ⭐⭐ |

---

## 📞 需要帮助？

如果部署遇到问题：
1. 截图错误信息
2. 检查各平台的 Logs
3. 重新按步骤操作

**祝你部署顺利！** 🎊
