# 🛒 Trendyol Seller API

<div align="center">

![Trendyol Seller API](https://img.shields.io/badge/Trendyol-Seller%20API-FF6000?style=for-the-badge&logo=typescript&logoColor=white)

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg?style=flat-square)](https://github.com/hamzaciftci/trendyol-satici-api/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub Stars](https://img.shields.io/github/stars/hamzaciftci/trendyol-satici-api?style=flat-square&logo=github)](https://github.com/hamzaciftci/trendyol-satici-api/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/hamzaciftci/trendyol-satici-api?style=flat-square&logo=github)](https://github.com/hamzaciftci/trendyol-satici-api/issues)

**TypeScript/Node.js API client for stores selling on Trendyol Marketplace**

🇹🇷 [Türkçe](./README.md) | English

</div>

---

## 🎯 What Does It Do?

This library enables sellers with stores on Trendyol to:

- 📦 **List and manage** their products
- 📋 **Fetch and track** their orders
- ❓ **View and answer** customer questions
- 🏷️ **Search** brands and categories
- 🔗 **Integrate** webhooks

## 📦 Installation

```bash
git clone https://github.com/hamzaciftci/trendyol-satici-api.git
cd trendyol-satici-api
npm install
npm run build
```

## ⚙️ Configuration (IMPORTANT!)

**Enter your API information only in the `config.ts` file.** The entire project uses the information from this file.

### 1. Get API Information

1. Log in to [Trendyol Partner Panel](https://partner.trendyol.com/)
2. Click on your store name in the top right corner
3. **"Account Information"** > **"Integration Information"**
4. Copy the following information:
   - Supplier ID
   - API Key
   - API Secret

### 2. Edit config.ts File

```typescript
// config.ts

export const API_CONFIG: TrendyolConfig = {
    supplierId: '123456',           // Your Supplier ID
    apiKey: 'AbCdEfGh...',          // Your API Key
    apiSecret: 'XyZ123...',         // Your API Secret
    environment: 'production'        // or 'sandbox'
};
```

**That's it!** Now the entire project will use these settings.

## 🚀 Usage

### Run Tests

```bash
npm test
```

### Run Example Code

```bash
npx ts-node example.ts
```

### Use in Your Own Code

```typescript
import { TrendyolClient } from './src';
import { API_CONFIG } from './config';

// Create client (information from config.ts is automatically used)
const client = new TrendyolClient(API_CONFIG);

// Fetch products
const products = await client.getProducts({ size: 10 });

// Fetch orders
const orders = await client.getRecentOrders(7);

// Fetch customer questions
const questions = await client.getUnansweredQuestions();
```

## 📊 Available Features

| Feature | Method | Description |
|---------|--------|-------------|
| **Products** | `getProducts()` | Product list |
| | `getProductByBarcode()` | Search product by barcode |
| **Orders** | `getOrders()` | Order list |
| | `getRecentOrders()` | Orders from last X days |
| **Returns** | `getClaims()` | Returns/claims list |
| | `getRecentClaims()` | Returns from last X days |
| | `getClaimIssueReasons()` | Return reasons |
| **Brands** | `getBrands()` | Brand list |
| | `getBrandByName()` | Search brand by name |
| **Categories** | `getCategories()` | Category list |
| | `getCategoryAttributes()` | Category attributes |
| **Questions** | `getQuestions()` | Customer questions |
| | `getUnansweredQuestions()` | Pending questions |
| | `answerQuestion()` | Answer question |
| **Webhook** | `getWebhooks()` | Webhook list |
| | `createWebhook()` | Create webhook |
| | `deleteWebhook()` | Delete webhook |

## 📁 Project Structure

```
trendyol-satici-api/
├── config.ts         # ⚠️ ENTER API INFORMATION HERE
├── src/
│   ├── index.ts      # Main export
│   ├── client.ts     # TrendyolClient class
│   ├── types.ts      # TypeScript types
│   ├── endpoints.ts  # API endpoints
│   └── utils.ts      # Helper functions
├── test.ts           # Test script
├── example.ts        # Usage example
└── ...
```

## 🔧 API Response Structure

```typescript
interface ApiResponse<T> {
    success: boolean;      // Is the operation successful?
    statusCode: number;    // HTTP status code
    data?: T;              // Returned data
    error?: string;        // Error message
}
```

**Usage:**

```typescript
const response = await client.getProducts({ size: 10 });

if (response.success) {
    console.log('Products:', response.data);
} else {
    console.error('Error:', response.error);
}
```

## 📝 Filtering Examples

### Product Filters

```typescript
await client.getProducts({
    approved: true,         // Approved products
    onSale: true,           // Products on sale
    barcode: '8680...',     // Barcode
    stockCode: 'STK001',    // Stock code
    size: 50                // Records per page
});
```

### Order Filters

```typescript
await client.getOrders({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'Created',
    size: 100
});
```

### Return (Claims) Filters

```typescript
// Fetch returns from last 30 days
const claims = await client.getRecentClaims(30);

// Fetch claims with filters
await client.getClaims({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    claimStatus: 'Created',
    size: 50
});

// Get return reasons
const reasons = await client.getClaimIssueReasons();
```

## 🔄 Latest Update: Trendyol API Changes

Changes to be implemented on **February 2, 2026** have been integrated into the system:

### Order Packages
- **New fields:** `cancelledBy`, `cancelReason`, `cancelReasonCode`, `lineTotalDiscount`, `packageTotalDiscount`
- **Field name changes:** 
  - `totalPrice` → `packageTotalPrice`
  - `grossAmount` → `packageGrossAmount`
  - `merchantSku` → `stockCode`
  - `merchantId` → `sellerId`
  - `vatBaseAmount` → `vatRate`
  - and others...
- **Removed fields:** `sku`, `scheduledDeliveryStoreId`, `agreedDeliveryDateExtendible`, `groupDeal`, etc.

### Return Packages (Claims)
- **Field name changes:**
  - `content/id` → `claimId`
  - `vatBaseAmount` → `vatRate`

See `src/types.ts` file for details.

## 🌐 API Endpoints

| Environment | URL |
|-------------|-----|
| **Production** | `https://apigw.trendyol.com` |
| **Sandbox** | `https://stageapigw.trendyol.com` |

## 📚 Resources

- [Trendyol Developer Portal](https://developers.trendyol.com/)
- [Trendyol Partner Panel](https://partner.trendyol.com/)

## 🤝 Contributing

We welcome your contributions! See the [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

## 👨‍💻 Developer

**Hamza ÇİFTÇİ** - hamzaciftci80@gmail.com

## 📄 License

MIT License - [LICENSE](LICENSE)

---

<div align="center">

⭐ Don't forget to star this project if you found it useful!

</div>
