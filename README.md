# 🛒 Trendyol Satıcı API

<div align="center">

![Trendyol Satıcı API](https://img.shields.io/badge/Trendyol-Satıcı%20API-FF6000?style=for-the-badge&logo=typescript&logoColor=white)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?style=flat-square)](https://nodejs.org/)

**Trendyol Marketplace'te satış yapan mağazalar için TypeScript/Node.js API client**

</div>

---

## 🎯 Ne İşe Yarar?

Bu kütüphane, Trendyol'da mağazası olan satıcıların:

- 📦 **Ürünlerini** listelemesini ve yönetmesini
- 📋 **Siparişlerini** çekmesini ve takip etmesini
- ❓ **Müşteri sorularını** görüntülemesini ve cevaplamasını
- 🏷️ **Marka ve kategorileri** aramasını
- 🔗 **Webhook** entegrasyonu yapmasını

sağlar.

## 📦 Kurulum

```bash
git clone https://github.com/hamzaciftci/trendyol-satici-api.git
cd trendyol-satici-api
npm install
npm run build
```

## ⚙️ Yapılandırma (ÖNEMLİ!)

**API bilgilerinizi sadece `config.ts` dosyasına girin.** Tüm proje bu dosyadaki bilgileri kullanır.

### 1. API Bilgilerini Alın

1. [Trendyol Partner Panel](https://partner.trendyol.com/)'e giriş yapın
2. Sağ üst köşeden mağaza adınıza tıklayın
3. **"Hesap Bilgilerim"** > **"Entegrasyon Bilgileri"**
4. Aşağıdaki bilgileri kopyalayın:
   - Tedarikçi ID (Supplier ID)
   - API Anahtarı (API Key)
   - API Gizli Anahtarı (API Secret)

### 2. config.ts Dosyasını Düzenleyin

```typescript
// config.ts

export const API_CONFIG: TrendyolConfig = {
    supplierId: '123456',           // Tedarikçi ID'niz
    apiKey: 'AbCdEfGh...',          // API Anahtarınız
    apiSecret: 'XyZ123...',         // API Gizli Anahtarınız
    environment: 'production'        // veya 'sandbox'
};
```

**Bu kadar!** Artık tüm proje bu ayarları kullanacak.

## 🚀 Kullanım

### Test Çalıştırma

```bash
npm test
```

### Örnek Kodu Çalıştırma

```bash
npx ts-node example.ts
```

### Kendi Kodunuzda Kullanma

```typescript
import { TrendyolClient } from './src';
import { API_CONFIG } from './config';

// Client oluştur (config.ts'deki bilgiler otomatik kullanılır)
const client = new TrendyolClient(API_CONFIG);

// Ürünleri çek
const urunler = await client.getProducts({ size: 10 });

// Siparişleri çek
const siparisler = await client.getRecentOrders(7);

// Müşteri sorularını çek
const sorular = await client.getUnansweredQuestions();
```

## 📊 Mevcut Özellikler

| Özellik | Metod | Açıklama |
|---------|-------|----------|
| **Ürünler** | `getProducts()` | Ürün listesi |
| | `getProductByBarcode()` | Barkodla ürün arama |
| **Siparişler** | `getOrders()` | Sipariş listesi |
| | `getRecentOrders()` | Son X günün siparişleri |
| **Markalar** | `getBrands()` | Marka listesi |
| | `getBrandByName()` | İsimle marka arama |
| **Kategoriler** | `getCategories()` | Kategori listesi |
| | `getCategoryAttributes()` | Kategori özellikleri |
| **Sorular** | `getQuestions()` | Müşteri soruları |
| | `getUnansweredQuestions()` | Bekleyen sorular |
| | `answerQuestion()` | Soru cevaplama |
| **Webhook** | `getWebhooks()` | Webhook listesi |
| | `createWebhook()` | Webhook oluşturma |
| | `deleteWebhook()` | Webhook silme |

## 📁 Proje Yapısı

```
trendyol-satici-api/
├── config.ts         # ⚠️ API BİLGİLERİNİ BURAYA GİRİN
├── src/
│   ├── index.ts      # Ana export
│   ├── client.ts     # TrendyolClient sınıfı
│   ├── types.ts      # TypeScript tipleri
│   ├── endpoints.ts  # API endpoint'leri
│   └── utils.ts      # Yardımcı fonksiyonlar
├── test.ts           # Test scripti
├── example.ts        # Kullanım örneği
└── ...
```

## 🔧 API Response Yapısı

```typescript
interface ApiResponse<T> {
    success: boolean;      // İşlem başarılı mı?
    statusCode: number;    // HTTP durum kodu
    data?: T;              // Dönen veri
    error?: string;        // Hata mesajı
}
```

**Kullanım:**

```typescript
const response = await client.getProducts({ size: 10 });

if (response.success) {
    console.log('Ürünler:', response.data);
} else {
    console.error('Hata:', response.error);
}
```

## 📝 Filtreleme Örnekleri

### Ürün Filtreleri

```typescript
await client.getProducts({
    approved: true,         // Onaylı ürünler
    onSale: true,           // Satışta olanlar
    barcode: '8680...',     // Barkod
    stockCode: 'STK001',    // Stok kodu
    size: 50                // Sayfa başına kayıt
});
```

### Sipariş Filtreleri

```typescript
await client.getOrders({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'Created',
    size: 100
});
```

## 🔄 Son Güncelleme: Trendyol API Değişiklikleri

**2 Şubat 2026** tarihinde uygulanacak değişiklikler sisteme entegre edildi:

- Yeni alanlar: `cancelledBy`, `cancelReason`, `lineTotalDiscount`, vb.
- İsim değişiklikleri: `totalPrice` → `packageTotalPrice`, vb.

Detaylar için `src/types.ts` dosyasına bakın.

## 🌐 API Endpoint'leri

| Ortam | URL |
|-------|-----|
| **Production** | `https://apigw.trendyol.com` |
| **Sandbox** | `https://stageapigw.trendyol.com` |

## 📚 Kaynaklar

- [Trendyol Developer Portal](https://developers.trendyol.com/)
- [Trendyol Partner Panel](https://partner.trendyol.com/)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Detaylar için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

## 👨‍💻 Geliştirici

**Hamza ÇİFTÇİ** - hamzaciftci80@gmail.com

## 📄 Lisans

MIT License - [LICENSE](LICENSE)

---

<div align="center">

⭐ Bu projeyi faydalı bulduysanız yıldız vermeyi unutmayın!

</div>
