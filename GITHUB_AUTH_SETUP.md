# GitHub Authentication Setup Guide

本指南将帮助你配置 Supabase GitHub 登录功能。

## 步骤 1: 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册或登录你的账户
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - **Name**: nano-banana-ai-editor (或任何你喜欢的名称)
   - **Database Password**: 设置一个强密码
   - **Region**: 选择离你最近的区域
5. 点击 "Create new project" 并等待项目初始化完成

## 步骤 2: 获取 Supabase 凭据

1. 在项目仪表板中，点击左侧菜单的 "Settings" (齿轮图标)
2. 点击 "API" 选项卡
3. 复制以下信息：
   - **Project URL**: 你的项目 URL (格式: `https://xxx.supabase.co`)
   - **anon/public key**: 公开的 API 密钥

4. 更新项目的 `.env.local` 文件：

```env
OPENROUTER_API_KEY=sk-or-v1-你的密钥

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://你的项目id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
```

## 步骤 3: 在 GitHub 创建 OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "OAuth Apps" → "New OAuth App"
3. 填写应用信息：
   - **Application name**: Nano Banana AI Editor
   - **Homepage URL**:
     - 开发环境: `http://localhost:3000`
     - 生产环境: `https://你的域名.com`
   - **Authorization callback URL**: `https://你的项目id.supabase.co/auth/v1/callback`
     - 这个 URL 可以在 Supabase 项目的 Authentication → Providers 中找到
4. 点击 "Register application"
5. 复制 **Client ID**
6. 点击 "Generate a new client secret" 并复制 **Client Secret**

## 步骤 4: 在 Supabase 配置 GitHub Provider

1. 在 Supabase 项目仪表板中，点击左侧菜单的 "Authentication"
2. 点击 "Providers" 选项卡
3. 找到 "GitHub" 并点击展开
4. 启用 GitHub provider：
   - 将开关切换到 **Enabled**
5. 填写 GitHub OAuth 凭据：
   - **Client ID**: 从步骤 3 复制的 Client ID
   - **Client Secret**: 从步骤 3 复制的 Client Secret
6. 点击 "Save" 保存配置

## 步骤 5: 配置重定向 URLs (可选但推荐)

1. 在 Supabase Authentication 设置中，点击 "URL Configuration"
2. 在 "Site URL" 中设置你的应用 URL：
   - 开发环境: `http://localhost:3000`
   - 生产环境: `https://你的域名.com`
3. 在 "Redirect URLs" 中添加允许的重定向 URL：
   - 开发环境: `http://localhost:3000/**`
   - 生产环境: `https://你的域名.com/**`

## 步骤 6: 测试登录功能

1. 重启开发服务器：
```bash
npm run dev
```

2. 访问 [http://localhost:3000](http://localhost:3000)
3. 点击页面右上角的 "Sign in with GitHub" 按钮
4. 你会被重定向到 GitHub 授权页面
5. 授权后，你应该会被重定向回应用，并看到你的 GitHub 用户信息

## 常见问题

### 问题 1: "Invalid OAuth configuration"
**解决方案**: 检查 Supabase 中的 GitHub Client ID 和 Client Secret 是否正确配置。

### 问题 2: 重定向到错误页面
**解决方案**:
- 确保 GitHub OAuth App 的 callback URL 设置为 `https://你的项目id.supabase.co/auth/v1/callback`
- 检查 Supabase 的 URL Configuration 中是否添加了正确的 Site URL

### 问题 3: "Authentication Error"
**解决方案**:
- 检查 `.env.local` 文件中的环境变量是否正确
- 重启开发服务器以确保环境变量被加载

## 生产环境部署

在 Vercel 或其他平台部署时，记得添加以下环境变量：

```
OPENROUTER_API_KEY=你的密钥
NEXT_PUBLIC_SUPABASE_URL=https://你的项目id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
```

同时，在 GitHub OAuth App 中添加生产环境的 callback URL。

---

完成以上步骤后，你的应用就可以使用 GitHub 登录了！🎉
