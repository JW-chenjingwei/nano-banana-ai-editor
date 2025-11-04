# Google Authentication Setup Guide

本指南将帮助你配置 Supabase Google 登录功能。

## 步骤 1: 创建 Google Cloud 项目和 OAuth 凭据

### 1.1 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 登录你的 Google 账户
3. 点击顶部的项目选择器，然后点击 "新建项目"
4. 输入项目名称（例如："Nano Banana AI Editor"）
5. 点击 "创建"

### 1.2 启用必要的 API

1. 在左侧菜单中，点击 "API 和服务" → "启用的 API 和服务"
2. 点击 "+ 启用 API 和服务"
3. 搜索 "Google+ API" 或 "Google Identity"
4. 点击并启用该 API

### 1.3 配置 OAuth 同意屏幕

1. 在左侧菜单中，点击 "API 和服务" → "OAuth 同意屏幕"
2. 选择用户类型：
   - **外部**：任何 Google 账户都可以登录（推荐用于公开应用）
   - **内部**：仅限你的 Google Workspace 组织内的用户
3. 点击 "创建"
4. 填写应用信息：
   - **应用名称**: Nano Banana AI Editor
   - **用户支持电子邮件**: 你的邮箱
   - **应用首页**: `http://localhost:3000`（开发环境）
   - **应用隐私政策链接**: 如果有的话
   - **应用服务条款链接**: 如果有的话
   - **已获授权的网域**: 如果有自定义域名，添加在这里
   - **开发者联系信息**: 你的邮箱
5. 点击 "保存并继续"
6. **作用域**：点击 "保存并继续"（使用默认作用域即可）
7. **测试用户**（如果选择了"外部"且应用处于测试模式）：
   - 点击 "+ 添加用户"
   - 添加你的测试邮箱地址
   - 点击 "保存并继续"
8. 点击 "返回控制台"

### 1.4 创建 OAuth 2.0 客户端 ID

1. 在左侧菜单中，点击 "API 和服务" → "凭据"
2. 点击顶部的 "+ 创建凭据" → "OAuth 客户端 ID"
3. 选择应用类型：**Web 应用**
4. 输入名称：例如 "Nano Banana Web Client"
5. 配置重定向 URI：
   - 在 "已获授权的重定向 URI" 部分，点击 "+ 添加 URI"
   - 添加你的 Supabase 回调 URL：
     ```
     https://你的项目id.supabase.co/auth/v1/callback
     ```
   - 这个 URL 可以在 Supabase Dashboard → Authentication → Providers → Google 中找到
6. 点击 "创建"
7. 弹出窗口会显示你的凭据：
   - **客户端 ID**: 复制并保存
   - **客户端密钥**: 复制并保存

## 步骤 2: 在 Supabase 配置 Google Provider

1. 访问你的 [Supabase 项目控制台](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 **Authentication** → **Providers**
4. 找到 **Google** 并点击展开
5. 启用 Google provider：
   - 将 **Enable Sign in with Google** 开关打开（设置为启用状态）
6. 填写 Google OAuth 凭据：
   - **Client ID (for OAuth)**: 粘贴从 Google Cloud Console 复制的客户端 ID
   - **Client Secret (for OAuth)**: 粘贴从 Google Cloud Console 复制的客户端密钥
7. （可选）配置其他设置：
   - **Skip nonce check**: 通常保持关闭
   - **Authorized Client IDs**: 如果你有移动应用，可以添加它们的客户端 ID
8. 点击 **Save** 保存配置

## 步骤 3: 配置 Supabase 重定向 URLs

1. 在 Supabase Dashboard 中，仍在 Authentication 设置中
2. 点击 "URL Configuration" 选项卡
3. 配置以下 URL：

   **Site URL**（你的应用主 URL）:
   - 开发环境: `http://localhost:3000`
   - 生产环境: `https://你的域名.com`

   **Redirect URLs**（允许的重定向 URL 列表）:
   - 开发环境: `http://localhost:3000/**`
   - 生产环境: `https://你的域名.com/**`

4. 点击 **Save** 保存

## 步骤 4: 测试 Google 登录

1. 确保开发服务器正在运行：
   ```bash
   npm run dev
   ```

2. 访问 [http://localhost:3000](http://localhost:3000)

3. 点击页面右上角的 **Google** 登录按钮

4. 你会被重定向到 Google 登录页面

5. 选择你的 Google 账户并授权

6. 授权后，你应该会被重定向回应用，并看到你的 Google 用户信息

## 常见问题

### 问题 1: "Error 400: redirect_uri_mismatch"

**原因**: Google OAuth 客户端中配置的重定向 URI 与实际请求的不匹配。

**解决方案**:
1. 检查 Google Cloud Console 中的重定向 URI 是否正确
2. 确保使用的是 Supabase 的回调 URL，而不是你应用的 URL
3. 格式应该是：`https://项目id.supabase.co/auth/v1/callback`

### 问题 2: "Access blocked: This app's request is invalid"

**原因**: OAuth 同意屏幕配置不完整或应用处于测试模式。

**解决方案**:
1. 返回 OAuth 同意屏幕配置
2. 确保所有必填字段都已填写
3. 如果应用处于测试模式，确保你使用的 Google 账户已添加为测试用户
4. 或者将应用发布到生产环境（需要 Google 审核）

### 问题 3: "Unsupported provider: provider is not enabled"

**解决方案**:
1. 确保在 Supabase Dashboard 中启用了 Google provider
2. 确保 Client ID 和 Client Secret 已正确填写
3. 点击了 Save 按钮保存配置

### 问题 4: 显示 "此应用未经验证"

**原因**: Google 检测到应用使用了敏感的 OAuth 作用域，需要验证。

**解决方案**:
1. 在测试阶段，点击 "高级" → "转到[应用名称]（不安全）"继续
2. 如果要发布应用，需要完成 Google 的应用验证流程

## 生产环境部署

### 更新 Google Cloud Console 配置

在部署到生产环境前，需要更新 Google OAuth 客户端：

1. 访问 Google Cloud Console → API 和服务 → 凭据
2. 点击你的 OAuth 2.0 客户端 ID
3. 在 "已获授权的重定向 URI" 中添加生产环境的回调 URL：
   - 如果使用相同的 Supabase 项目：URL 不变
   - 如果使用不同的 Supabase 项目：添加新项目的回调 URL
4. 更新 "已获授权的 JavaScript 来源"（如果需要）：
   ```
   https://你的生产域名.com
   ```
5. 点击 "保存"

### 更新 OAuth 同意屏幕

1. 更新应用首页 URL 为生产环境 URL
2. 如果应用处于测试模式，考虑提交 Google 审核以发布到生产环境

### 环境变量

确保在生产环境（Vercel、Docker 等）中配置了正确的环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://你的项目id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon密钥
OPENROUTER_API_KEY=你的密钥
```

## 多环境配置建议

### 选项 1: 使用同一个 Google OAuth 客户端

在同一个 OAuth 客户端中添加多个重定向 URI：
- `https://项目id.supabase.co/auth/v1/callback`（开发）
- `https://生产项目id.supabase.co/auth/v1/callback`（生产）

**优点**: 管理简单
**缺点**: 开发和生产共享凭据

### 选项 2: 为每个环境创建独立的 OAuth 客户端

为开发环境和生产环境分别创建 OAuth 客户端：
- 开发环境使用一个 Client ID/Secret
- 生产环境使用另一个 Client ID/Secret

**优点**: 更好的安全隔离
**缺点**: 需要管理多套凭据

## 安全建议

1. ✅ 定期轮换 OAuth 客户端密钥
2. ✅ 不要将 OAuth 凭据提交到版本控制
3. ✅ 在生产环境使用环境变量管理凭据
4. ✅ 限制重定向 URI 为已知的可信 URL
5. ✅ 监控 OAuth 使用情况，及时发现异常
6. ✅ 在 Google Cloud Console 中启用 API 配额和监控

---

完成以上步骤后，你的应用就可以使用 Google 登录了！🎉

如有任何问题，请参考：
- [Supabase Google Auth 文档](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
