# Creem 支付调试指南

## 当前问题
API 返回 403 Forbidden 错误，即使 Product ID 正确发送到服务器。

## 调试步骤

### 1. 验证 Product ID 显示
访问 http://localhost:3000/pricing，点击"Get Started"按钮，应该看到调试弹窗显示：
```
🔍 DEBUG INFO:

Tier: Basic
Billing Cycle: monthly
Product ID: prod_73f2TIH0PZehGLpKVzhShE

This will be sent to the API.
```

如果显示的 Product ID 不正确，需要检查 `components/pricing.tsx` 文件。

### 2. 检查 Creem Dashboard 配置

访问 [Creem Dashboard](https://dashboard.creem.io/) 并确认：

#### ✅ 测试模式检查
1. 确认右上角显示 **"Test Mode"** 开关已打开
2. API Key 必须是 `creem_test_` 开头（当前：`creem_test_qVhVQw118ude1jAP0o3CD`）
3. **重要**：产品(Products)必须也在测试模式下创建

#### ✅ 产品存在性检查
1. 进入 **Products** 页面
2. 搜索 Product ID：`prod_73f2TIH0PZehGLpKVzhShE`
3. 确认产品确实存在且状态为 **Active**
4. **关键**：确认产品是在 **测试模式** 下创建的

#### ✅ 产品配置检查
点击产品查看详情，确认：
- **Name**: Basic Monthly（或任意名称）
- **Price**: $12.00
- **Billing**: Recurring - Monthly
- **Status**: Active
- **Mode**: Test（必须是测试模式）

### 3. 常见问题及解决方案

#### 问题 A：产品不存在
**症状**：403 Forbidden
**解决**：在 Creem Dashboard 的 Products 页面创建产品
- 点击 "Create Product"
- 填写产品信息
- 确认在测试模式下创建
- 复制生成的 Product ID 并更新到代码中

#### 问题 B：测试/生产模式不匹配
**症状**：403 Forbidden
**解决**：
- 如果 API Key 是 `creem_test_*`，产品必须在测试模式下创建
- 如果 API Key 是 `creem_live_*`，产品必须在生产模式下创建
- **不能混用**

#### 问题 C：API Key 权限不足
**症状**：403 Forbidden
**解决**：
1. 进入 **Settings** → **API Keys**
2. 检查 API Key 的权限设置
3. 确保有 "Create Checkout Sessions" 权限
4. 如果没有，重新生成 API Key

#### 问题 D：Product ID 拼写错误
**症状**：403 Forbidden
**解决**：
1. 从 Creem Dashboard 直接复制 Product ID
2. 对比代码中的 ID 是否完全一致（注意大小写）
3. 当前配置的 ID：`prod_73f2TIH0PZehGLpKVzhShE`

### 4. 验证 API 响应

检查终端输出，应该看到：
```
📦 Received priceId: prod_73f2TIH0PZehGLpKVzhShE
💳 Billing cycle: monthly
```

如果看到 403 错误：
```
Creem API error: {
  trace_id: '...',
  status: 403,
  error: 'Forbidden',
  timestamp: ...
}
```

这意味着 Creem API 拒绝了请求，原因通常是上述问题之一。

### 5. 测试 API Key

可以使用 curl 命令直接测试 API Key 是否有效：

```bash
curl -X GET https://api.creem.io/v1/products \
  -H "x-api-key: creem_test_qVhVQw118ude1jAP0o3CD"
```

如果返回产品列表，说明 API Key 有效。
如果返回 401/403，说明 API Key 无效或权限不足。

### 6. 创建所有产品

根据定价页面需要创建以下产品：

#### 订阅套餐
1. **Basic Monthly** (`prod_73f2TIH0PZehGLpKVzhShE`)
   - Price: $12.00
   - Billing: Monthly
   - Credits: 150

2. **Basic Yearly** (`prod_r6yj7Vfk0cfz9yujZphp`)
   - Price: $144.00
   - Billing: Yearly
   - Credits: 1800

3. **Pro Monthly** (`prod_65Z9K9I3Q01qH9SDcMw91I`)
   - Price: $19.50
   - Billing: Monthly
   - Credits: 800

4. **Pro Yearly** (`prod_3UEd1QgQ7UIzL8JexR7J1o`)
   - Price: $234.00
   - Billing: Yearly
   - Credits: 9600

5. **Max Monthly** (`prod_2FkOnfFXDpmHoGx5MKTFba`)
   - Price: $80.00
   - Billing: Monthly
   - Credits: 4600

6. **Max Yearly** (`prod_4kpgGD1NYVpeun1SDwK7Sw`)
   - Price: $960.00
   - Billing: Yearly
   - Credits: 55200

#### 一次性积分包
1. **Starter Pack**
   - Price: $10.00
   - Billing: One-time
   - Credits: 200

2. **Growth Pack**
   - Price: $25.00
   - Billing: One-time
   - Credits: 533

3. **Professional Pack**
   - Price: $60.00
   - Billing: One-time
   - Credits: 1333

4. **Enterprise Pack**
   - Price: $200.00
   - Billing: One-time
   - Credits: 5333

### 7. 下一步

1. ✅ 首先点击订阅按钮，查看调试弹窗显示的 Product ID
2. ✅ 登录 Creem Dashboard，确认产品确实存在
3. ✅ 确认产品和 API Key 都在测试模式
4. ✅ 如果产品不存在，创建产品并更新 Product ID
5. ✅ 重新测试订阅流程

## 当前状态
- ✅ 生产服务器运行中：http://localhost:3000
- ✅ 调试代码已添加
- ✅ API Key 已配置：`creem_test_qVhVQw118ude1jAP0o3CD`
- ⏳ 等待用户测试并确认 Product ID
- ⏳ 等待用户验证 Creem Dashboard 配置
