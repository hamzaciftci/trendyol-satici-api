# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) standardına,
versiyonlama [Semantic Versioning](https://semver.org/lang/tr/) standardına uygundur.

## [1.1.0] - 2026-01-08

### Eklendi
- 📦 **İade (Claims) Servisi** - Trendyol'un yeni iade API'si için tam destek
  - `getClaims()` - İade taleplerini listele
  - `getRecentClaims()` - Son X günün iade taleplerini getir
  - `getClaimIssueReasons()` - İade nedenlerini getir
- `TrendyolClaim`, `TrendyolClaimItem`, `ClaimFilters` TypeScript tipleri
- `ClaimIssueReason` arayüzü
- Claims endpoint'leri (`CLAIMS_ENDPOINTS`)

### Değişti
- 📝 README.md güncellendi - Claims servisi dokümantasyonu eklendi
- 🧪 Test dosyasına claims testi eklendi

### API Değişiklikleri (2 Şubat 2026)
Trendyol'un duyurduğu API değişikliklerine uyum sağlandı:

#### İade Paketleri (Claims)
- `content/id` → `claimId` (alan ismi değişikliği)
- `vatBaseAmount` → `vatRate` (alan ismi değişikliği)

## [1.0.0] - 2026-01-08

### Eklendi
- 🚀 İlk sürüm
- **Ürün Yönetimi**
  - `getProducts()` - Ürün listesi
  - `getProductByBarcode()` - Barkodla ürün arama
- **Sipariş Yönetimi**
  - `getOrders()` - Sipariş listesi
  - `getRecentOrders()` - Son X günün siparişleri
- **Marka Yönetimi**
  - `getBrands()` - Marka listesi
  - `getBrandByName()` - İsimle marka arama
- **Kategori Yönetimi**
  - `getCategories()` - Kategori listesi
  - `getCategoryAttributes()` - Kategori özellikleri
- **Müşteri Soruları**
  - `getQuestions()` - Müşteri soruları
  - `getUnansweredQuestions()` - Bekleyen sorular
  - `answerQuestion()` - Soru cevaplama
- **Webhook Yönetimi**
  - `getWebhooks()` - Webhook listesi
  - `createWebhook()` - Webhook oluşturma
  - `deleteWebhook()` - Webhook silme
- TypeScript tip desteği
- Production ve Sandbox ortam desteği
- Kapsamlı dokümantasyon

### API Değişiklikleri (2 Şubat 2026)
Trendyol'un duyurduğu API değişikliklerine uyum sağlandı:

#### Sipariş Paketleri
- Yeni alanlar: `cancelledBy`, `cancelReason`, `cancelReasonCode`, `lineTotalDiscount`, `packageTotalDiscount`
- Alan ismi değişiklikleri:
  - `id` → `shipmentPackageId`
  - `merchantId` → `sellerId`
  - `grossAmount` → `packageGrossAmount`
  - `totalDiscount` → `packageSellerDiscount`
  - `totalTyDiscount` → `packageTyDiscount`
  - `totalPrice` → `packageTotalPrice`
  - `merchantSku` → `stockCode`
  - `productCode` → `contentId`
  - `vatBaseAmount` → `vatRate`
- Kaldırılan alanlar: `sku`, `scheduledDeliveryStoreId`, `agreedDeliveryDateExtendible`, `groupDeal`, vb.

---

[1.1.0]: https://github.com/hamzaciftci/trendyol-satici-api/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/hamzaciftci/trendyol-satici-api/releases/tag/v1.0.0
