# Changelog

Tüm önemli değişiklikler bu dosyada belgelenir.

Format [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) standardına,
versiyonlama [Semantic Versioning](https://semver.org/lang/tr/) standardına uygundur.

## [2.0.0] - 2026-02-11

### BREAKING: Content-Based Product Model (v2)

Trendyol 10 Subat 2026 tarihinde urun servislerini barkod bazli yapidan content bazli yapiya gecirdigini duyurdu. Bu surum v2 API'ye tam uyum saglar.

**v1 servisleri 10 Agustos 2026 tarihinde kapanacaktir.**

### Eklendi
- **Urun Yaratma v2** - `createProductV2()` - Content-based urun olusturma
- **Urun Filtreleme v2**
  - `getProductBasicInfoV2()` - Barkod ile temel bilgi sorgulama
  - `getUnapprovedProductsV2()` - Onaysiz urunleri filtreleme (red nedenleri dahil)
  - `getApprovedProductsV2()` - Onayli urunleri filtreleme (content + varyant yapisi)
- **Urun Guncelleme v2**
  - `updateUnapprovedProductV2()` - Onaysiz urun guncelleme
  - `updateApprovedContentV2()` - Onayli urun content guncelleme
  - `updateApprovedVariantV2()` - Onayli urun varyant guncelleme
  - `updateDeliveryOptionV2()` - Teslimat bilgisi guncelleme
- **Kategori v2**
  - `getCategoryAttributesV2()` - Kategori ozellik listesi (varianter, slicer, allowMultiple)
  - `getCategoryAttributeValuesV2()` - Ozellik degerleri (sayfalamali)
- v2 TypeScript tipleri: `ApprovedProductV2`, `UnapprovedProductV2`, `ProductBasicInfoV2`, `CategoryAttributeV2` vb.
- `PaginatedResponseV2` - nextPageToken destekli sayfalama
- `BatchRequestResponse` tipi
- Jest test altyapisi (26 test)
- `examples/v2/` ornek dosyalari (5 adet)
- Migration guide (README icinde)

### Degisti
- Paket versiyonu 2.0.0'a yukseltildi
- `getProducts()`, `getProductByBarcode()`, `getCategoryAttributes()` metodlari `@deprecated` olarak isaretlendi
- README tamamen yeniden yazildi (v2 gecis rehberi, ornek payload'lar, migration guide)
- Test altyapisi Jest'e gecti (`npm test` artik Jest calistirir)
- `npm run test:legacy` ile eski test script'i calistirilabilir

## [1.2.0] - 2026-01-13

### Eklendi
- 🏷️ **İndirim Görüntüleme Bilgileri** - Siparişte uygulanan indirimlerin detay bilgileri
  - `discountDisplays` alanı `TrendyolOrder` arayüzüne eklendi
  - `DiscountDisplay` arayüzü eklendi (`displayName`, `discountAmount`)
  - getShipmentPackages servisi ve webhook model desteği

### API Değişiklikleri (Ocak 2026)
Trendyol'un duyurduğu API değişikliklerine uyum sağlandı:

#### Sipariş Paketleri (getShipmentPackages)
- `discountDisplays` alanı eklendi - Siparişte uygulanan indirim detayları
  - `displayName`: İndirim adı (örn: "Sepette %20 İndirim", "Trendyol Plus'a Özel Fiyat")
  - `discountAmount`: İndirim tutarı

> **Referans:** 
> - https://developers.trendyol.com/docs/marketplace/siparis-entegrasyonu/siparis-paketlerini-cekme
> - https://developers.trendyol.com/docs/marketplace/webhook/webhook-model

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
