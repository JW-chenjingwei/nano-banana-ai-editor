# Creem Payment Integration Setup Guide

本指南将帮助你配置 Creem 支付集成。

## 什么是 Creem？

Creem 是一个开发者友好的支付平台，提供简单直观的 API 来处理支付和订阅。Creem 作为你的商户记录（Merchant of Record），处理支付、商户费用、欺诈检测和销售税。

## 步骤 1: 创建 Creem 账户

1. 访问 [https://creem.io](https://creem.io)
2. 点击 "Sign Up" 或 "Get Started"
3. 填写你的信息创建账户
4. 验证你的邮箱地址

## 步骤 2: 创建 Store（商店）

1. 登录 Creem 控制台
2. 点击 "Create Store" 或 "New Store"
3. 填写商店信息：
   - **Store Name**: Nano Banana AI Editor
   - **Store URL**: 你的域名（例如：nanobanana.ai）
   - **Currency**: USD（或你偏好的货币）
4. 点击 "Create" 创建商店

## 步骤 3: 获取 API 密钥

1. 在 Creem 控制台中，进入你的商店
2. 点击 "Developers" 或 "Settings" → "API Keys"
3. 你会看到两种密钥：
   - **Test Mode Keys**（测试模式）- 用于开发和测试
   - **Live Mode Keys**（生产模式）- 用于真实支付

4. 复制以下密钥：
   - **Secret Key** (API Key) - 用于服务器端 API 调用
   - **Webhook Secret** - 用于验证 webhook 签名

5. 更新项目的 `.env.local` 文件：

```env
# Creem Payment Configuration
CREEM_API_KEY=sk_test_xxxxxxxxxxxxxx  # 测试模式或 sk_live_xxxxxxxxxxxxxx 生产模式
CREEM_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
```

## 步骤 4: 创建产品和价格

### 4.1 创建订阅产品

1. 在 Creem 控制台，点击 "Products" → "Create Product"
2. 创建三个订阅产品：

**Basic 套餐:**
- **Name**: Basic Plan
- **Type**: Recurring（订阅）
- **Price**:
  - Monthly: $12/month
  - Yearly: $144/year
- 记录产品 ID（例如：`prod_basic_monthly` 和 `prod_basic_yearly`）

**Pro 套餐:**
- **Name**: Pro Plan
- **Type**: Recurring
- **Price**:
  - Monthly: $19.50/month
  - Yearly: $234/year
- 记录产品 ID

**Max 套餐:**
- **Name**: Max Plan
- **Type**: Recurring
- **Price**:
  - Monthly: $80/month
  - Yearly: $960/year
- 记录产品 ID

### 4.2 创建一次性购买产品（Credit Packs）

创建四个一次性购买产品：

1. **Starter Pack**: $10 - 200 credits
2. **Growth Pack**: $25 - 533 credits
3. **Professional Pack**: $60 - 1333 credits
4. **Enterprise Pack**: $200 - 5333 credits

**重要**: 记录每个产品的 Product ID（不是 Price ID），格式类似 `prod_xxxxxxxxxx`。

## 步骤 5: 更新代码中的 Product IDs

打开 [components/pricing.tsx](components/pricing.tsx) 文件，更新 `priceId` 字段为你在 Creem 中创建的实际 Product ID。

```typescript
priceId: {
  monthly: "prod_xxx_monthly",  // 替换为实际的 Product ID
  yearly: "prod_xxx_yearly"      // 替换为实际的 Product ID
}
```

**注意**: Creem 使用 `product_id` 而不是 `price_id`，每个产品（包括不同的计费周期）都有独立的 Product ID。

## 步骤 6: 配置 Webhook

Webhook 让 Creem 在支付事件发生时通知你的应用。

### 6.1 设置 Webhook URL

1. 在 Creem 控制台，点击 "Developers" → "Webhooks"
2. 点击 "Create Webhook Endpoint"
3. 填写信息：
   - **URL**:
     - 开发环境: `http://localhost:3000/api/payment/webhook`（需要使用 ngrok 等工具暴露本地端口）
     - 生产环境: `https://你的域名.com/api/payment/webhook`
   - **Events to receive**: 选择以下事件：
     - `checkout.session.completed` - 支付完成
     - `subscription.updated` - 订阅更新
     - `subscription.cancelled` - 订阅取消
     - `payment.succeeded` - 一次性支付成功
4. 点击 "Create Endpoint"
5. 复制 **Webhook Secret** 并更新到 `.env.local` 文件

### 6.2 开发环境测试 Webhook

由于 Creem 需要访问公网 URL 来发送 webhook，在本地开发时你需要使用工具如 ngrok：

```bash
# 安装 ngrok
npm install -g ngrok

# 启动 ngrok 隧道
ngrok http 3000

# 使用 ngrok 提供的 HTTPS URL 配置 webhook
# 例如: https://abc123.ngrok.io/api/payment/webhook
```

## 步骤 7: 设置 Supabase 数据库表

你需要在 Supabase 中创建表来存储订阅和购买信息。

### 7.1 创建 subscriptions 表

在 Supabase SQL Editor 中运行：

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  creem_customer_id TEXT,
  creem_subscription_id TEXT UNIQUE,
  price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  billing_cycle TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 设置 RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的订阅
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### 7.2 创建 credit_purchases 表

```sql
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  creem_payment_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_credit_purchases_user_id ON credit_purchases(user_id);

-- 设置 RLS
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON credit_purchases FOR SELECT
  USING (auth.uid() = user_id);
```

### 7.3 创建 user_credits 表（可选）

如果你想跟踪用户的积分余额：

```sql
CREATE TABLE user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  balance INTEGER DEFAULT 0 NOT NULL,
  total_earned INTEGER DEFAULT 0 NOT NULL,
  total_spent INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设置 RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);
```

## 步骤 8: 测试支付流程

### 8.1 测试模式

1. 确保使用 Test Mode API Key
2. 启动开发服务器：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3000/pricing
4. 点击任意套餐的 "Get Started" 按钮
5. 使用 Creem 提供的测试卡号进行测试：
   - **Card Number**: 4242 4242 4242 4242
   - **Expiry**: 任何未来日期
   - **CVC**: 任何3位数字
   - **ZIP**: 任何邮编

### 8.2 验证 Webhook

1. 完成测试支付后，检查：
   - 应用日志中的 webhook 事件
   - Supabase 数据库中的订阅记录
   - Creem 控制台中的 webhook 日志

## 步骤 9: 生产环境部署

### 9.1 切换到生产模式

1. 在 Creem 控制台切换到 "Live Mode"
2. 获取生产环境的 API 密钥
3. 更新生产环境的环境变量：

```env
CREEM_API_KEY=sk_live_xxxxxxxxxxxxxx
CREEM_WEBHOOK_SECRET=whsec_live_xxxxxxxxxxxxxx
```

### 9.2 配置生产环境 Webhook

1. 在 Creem Live Mode 中配置 webhook
2. 使用生产环境的 URL：`https://你的域名.com/api/payment/webhook`

### 9.3 Vercel 部署

在 Vercel 项目设置中添加环境变量：
- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`

## 常见问题

### 问题 1: "Payment system not configured"

**原因**: `CREEM_API_KEY` 环境变量未设置。

**解决方案**:
1. 检查 `.env.local` 文件中是否有 `CREEM_API_KEY`
2. 重启开发服务器以加载新的环境变量

### 问题 2: Webhook 未接收到事件

**原因**:
- Webhook URL 配置错误
- 本地开发时未使用 ngrok
- 防火墙阻止了请求

**解决方案**:
1. 验证 webhook URL 是否正确且可以公开访问
2. 检查 Creem 控制台中的 webhook 日志
3. 本地开发时使用 ngrok

### 问题 3: "Failed to create checkout session"

**原因**:
- API 密钥无效
- Price ID 不存在
- Creem API 请求失败

**解决方案**:
1. 检查 API 密钥是否正确
2. 验证 Price ID 是否在 Creem 中存在
3. 查看服务器日志中的详细错误信息

### 问题 4: 数据库写入失败

**原因**:
- Supabase 表未创建
- RLS 策略配置错误

**解决方案**:
1. 运行步骤 7 中的 SQL 语句创建表
2. 检查 RLS 策略是否正确配置

## API 参考

### 创建 Checkout Session

**Endpoint**: `POST /api/payment/create-checkout`

**Request Body**:
```json
{
  "priceId": "price_basic_monthly",
  "billingCycle": "monthly"
}
```

**Response**:
```json
{
  "checkoutUrl": "https://checkout.creem.io/...",
  "sessionId": "cs_xxx"
}
```

### Webhook Events

**Endpoint**: `POST /api/payment/webhook`

**支持的事件**:
- `checkout.session.completed` - 支付完成
- `subscription.updated` - 订阅更新
- `subscription.cancelled` - 订阅取消
- `payment.succeeded` - 一次性支付成功

## 安全建议

1. ✅ 永远不要在客户端暴露 Secret Key
2. ✅ 使用 HTTPS 进行所有 API 通信
3. ✅ 验证 webhook 签名（生产环境必须实现）
4. ✅ 定期轮换 API 密钥
5. ✅ 监控异常支付活动
6. ✅ 在生产环境启用 Creem 的欺诈检测功能

## 更多资源

- [Creem 官方文档](https://docs.creem.io)
- [Creem API 参考](https://docs.creem.io/api-reference)
- [Creem Dashboard](https://dashboard.creem.io)

---

完成以上步骤后，你的应用就可以接受支付了！🎉
