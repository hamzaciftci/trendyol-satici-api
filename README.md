# Trendyol Satici API

<div align="center">

![Trendyol Satici API](https://img.shields.io/badge/Trendyol-Satıcı%20API-FF6000?style=for-the-badge&logo=typescript&logoColor=white)

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)](https://github.com/hamzaciftci/trendyol-satici-api/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

**Trendyol Marketplace'te satis yapan magazalar icin TypeScript/Node.js API client**

**v2.0 - Content-Based Product Model destegi**

</div>

---

## v2.0 - Content-Based Yapiya Gecis

> **10 Subat 2026** tarihinde Trendyol, urun servislerini **barkod bazli yapidan content bazli yapiya** gecirdigini duyurdu. Eski v1 servisleri **10 Agustos 2026** tarihinde kapanacaktir.

Bu surum, Trendyol'un yeni v2 content-based API altyapisina tam uyumlu olarak guncellenmistir. v1 metodlari geriye donuk uyumluluk icin korunmus ancak `@deprecated` olarak isaretlenmistir.

### Yeni v2 Servisleri

| Servis | Metod | Endpoint |
|--------|-------|----------|
| Urun Yaratma v2 | `createProductV2()` | `POST /sellers/{id}/v2/products` |
| Temel Bilgi Filtreleme v2 | `getProductBasicInfoV2()` | `GET /sellers/{id}/product/{barcode}` |
| Onaysiz Urun Filtreleme v2 | `getUnapprovedProductsV2()` | `GET /sellers/{id}/products/unapproved` |
| Onayli Urun Filtreleme v2 | `getApprovedProductsV2()` | `GET /sellers/{id}/products/approved` |
| Onaysiz Urun Guncelleme v2 | `updateUnapprovedProductV2()` | `POST /sellers/{id}/products/unapproved-bulk-update` |
| Onayli Content Guncelleme v2 | `updateApprovedContentV2()` | `POST /sellers/{id}/products/content-bulk-update` |
| Onayli Varyant Guncelleme v2 | `updateApprovedVariantV2()` | `POST /sellers/{id}/products/variant-bulk-update` |
| Teslimat Guncelleme v2 | `updateDeliveryOptionV2()` | `POST /sellers/{id}/products/delivery-option-update` |
| Kategori Ozellik Listesi v2 | `getCategoryAttributesV2()` | `GET /categories/{id}/attributes` |
| Kategori Ozellik Degerleri v2 | `getCategoryAttributeValuesV2()` | `GET /categories/{id}/attributes/{attrId}/values` |

---

## Kurulum

```bash
git clone https://github.com/hamzaciftci/trendyol-satici-api.git
cd trendyol-satici-api
npm install
npm run build
```

## Yapilandirma

**API bilgilerinizi sadece `config.ts` dosyasina girin.**

### 1. API Bilgilerini Alin

1. [Trendyol Partner Panel](https://partner.trendyol.com/)'e giris yapin
2. Sag ust koseden magaza adiniza tiklayin
3. **"Hesap Bilgilerim"** > **"Entegrasyon Bilgileri"**

### 2. config.ts Dosyasini Duzenleyin

```typescript
export const API_CONFIG: TrendyolConfig = {
    supplierId: '123456',
    apiKey: 'AbCdEfGh...',
    apiSecret: 'XyZ123...',
    environment: 'production'
};
```

## Hizli Baslangic (v2)

```typescript
import { TrendyolClient } from 'trendyol-satici-api';

const client = new TrendyolClient({
    supplierId: '123456',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
});

// v2: Urun olustur
const result = await client.createProductV2({
    items: [{
        barcode: '1234567890',
        title: 'Ornek Urun',
        description: '<p>Aciklama</p>',
        productMainId: 'MAIN-001',
        brandId: 1791,
        categoryId: 411,
        quantity: 100,
        stockCode: 'STK-001',
        dimensionalWeight: 2,
        listPrice: 199.99,
        salePrice: 149.99,
        vatRate: 10,
        images: [{ url: 'https://example.com/img.jpg' }],
        attributes: [{ attributeId: 338, attributeValueIds: [6980] }],
    }],
});
console.log('Batch ID:', result.data?.batchRequestId);

// v2: Onayli urunleri listele (content-based)
const products = await client.getApprovedProductsV2({ status: 'onSale', size: 50 });
products.data?.content.forEach(content => {
    console.log(`Content ${content.contentId}: ${content.title}`);
    content.variants?.forEach(v => {
        console.log(`  Varyant: ${v.barcode} - ${v.price?.salePrice} TL`);
    });
});

// v2: Kategori ozellikleri
const attrs = await client.getCategoryAttributesV2(411);
attrs.data?.categoryAttributes.forEach(attr => {
    console.log(`${attr.attribute.name}: zorunlu=${attr.required}, varyant=${attr.varianter}`);
});
```

## Tum Ozellikler

### v2 Urun Islemleri (Content-Based)

| Metod | Aciklama |
|-------|----------|
| `createProductV2(data)` | Urun olustur (max 1.000 adet) |
| `getProductBasicInfoV2(barcode)` | Barkod ile temel bilgi sorgula |
| `getUnapprovedProductsV2(filters)` | Onaysiz urunleri listele |
| `getApprovedProductsV2(filters)` | Onayli urunleri listele (content-based) |
| `updateUnapprovedProductV2(data)` | Onaysiz urun guncelle |
| `updateApprovedContentV2(data)` | Onayli urun content guncelle |
| `updateApprovedVariantV2(data)` | Onayli urun varyant guncelle |
| `updateDeliveryOptionV2(data)` | Teslimat bilgisi guncelle |
| `getCategoryAttributesV2(categoryId)` | Kategori ozellikleri (v2) |
| `getCategoryAttributeValuesV2(catId, attrId, filters)` | Ozellik degerleri (v2) |

### Diger Servisler

| Ozellik | Metod | Aciklama |
|---------|-------|----------|
| **Siparisler** | `getOrders()` | Siparis listesi |
| | `getRecentOrders()` | Son X gunun siparisleri |
| **Iadeler** | `getClaims()` | Iade talepleri |
| | `getRecentClaims()` | Son X gunun iadeleri |
| | `getClaimIssueReasons()` | Iade nedenleri |
| **Finans** | `getSettlements()` | Satis/iade/indirim kayitlari |
| | `getOtherFinancials()` | Havale/fatura/kesinti kayitlari |
| **Markalar** | `getBrands()` | Marka listesi |
| | `getBrandByName()` | Isimle marka arama |
| **Kategoriler** | `getCategories()` | Kategori listesi |
| **Sorular** | `getQuestions()` | Musteri sorulari |
| | `getUnansweredQuestions()` | Bekleyen sorular |
| | `answerQuestion()` | Soru cevaplama |
| **Webhook** | `getWebhooks()` | Webhook listesi |
| | `createWebhook()` | Webhook olusturma |
| | `deleteWebhook()` | Webhook silme |

## v2 Kullanim Ornekleri

### Urun Olusturma (Varyantli)

```typescript
// Ayni productMainId ile varyant gruplama
await client.createProductV2({
    items: [
        {
            barcode: 'AYAKKABI-RED-42',
            title: 'Spor Ayakkabi - Kirmizi',
            productMainId: 'AYAKKABI-001', // Ayni group
            // ...diger alanlar
        },
        {
            barcode: 'AYAKKABI-BLUE-42',
            title: 'Spor Ayakkabi - Mavi',
            productMainId: 'AYAKKABI-001', // Ayni group
            // ...diger alanlar
        },
    ],
});
```

### Onayli Urun Content Guncelleme

```typescript
// NOT: barcode, productMainId, brandId, categoryId guncellenemez
// NOT: Ozellik guncellerken TUM ozellikleri gonderin
await client.updateApprovedContentV2({
    items: [{
        contentId: 9510902,    // getProductBasicInfoV2 veya getApprovedProductsV2 ile alin
        title: 'Yeni Baslik',
        description: '<p>Yeni aciklama</p>',
        images: [{ url: 'https://example.com/new.jpg' }],
    }],
});
```

### Onaysiz Urunleri Filtreleme (Red Nedenleriyle)

```typescript
const rejected = await client.getUnapprovedProductsV2({
    status: 'rejected',
    size: 50,
});

rejected.data?.content.forEach(product => {
    console.log(`${product.barcode}: ${product.title}`);
    product.rejectReasonDetails?.forEach(reason => {
        console.log(`  Red: ${reason.rejectReason} - ${reason.rejectReasonDetail}`);
    });
});
```

### Sayfalama (10.000+ Kayit)

```typescript
// nextPageToken ile buyuk veri setlerini sayfalama
let token: string | undefined;
do {
    const page = await client.getApprovedProductsV2({
        size: 100,
        nextPageToken: token,
    });
    // page.data?.content ile calisin...
    token = page.data?.nextPageToken;
} while (token);
```

## v1 -> v2 Migration Guide

### Temel Degisiklikler

| v1 | v2 | Aciklama |
|----|-----|----------|
| Barkod bazli yapi | Content bazli yapi | `contentId` urun gruplama birimi |
| `getProducts()` | `getApprovedProductsV2()` / `getUnapprovedProductsV2()` | Ayri onay durumuna gore filtreleme |
| `getProductByBarcode()` | `getProductBasicInfoV2()` | Barkod ile temel bilgi sorgulama |
| `getCategoryAttributes()` | `getCategoryAttributesV2()` | varianter, slicer, allowMultiple alanlar eklendi |
| Tek urun guncelleme | Content / Varyant / Teslimat ayri servisler | Daha granular guncelleme |
| Sayfa bazli sayfalama | `nextPageToken` destegi | 10.000+ kayit icin performansli |

### v1 Deprecated Metodlar

Asagidaki metodlar hala calisir ancak `@deprecated` olarak isaretlenmistir:

- `getProducts()` -> `getApprovedProductsV2()` veya `getUnapprovedProductsV2()`
- `getProductByBarcode()` -> `getProductBasicInfoV2()`
- `getCategoryAttributes()` -> `getCategoryAttributesV2()`

### Content-Based Yapi Nedir?

v1'de her urun barkod ile tanimlanirdi. v2'de ise:

```
Content (contentId: 9510902)
  ├── title, description, images, attributes (content seviyesi)
  ├── Varyant 1 (barcode: RED-42, price, stock, deliveryOptions)
  ├── Varyant 2 (barcode: BLUE-42, price, stock, deliveryOptions)
  └── Varyant 3 (barcode: RED-43, price, stock, deliveryOptions)
```

Bir **content** birden fazla **varyant** icerir. Content seviyesinde baslik, aciklama, gorsel ve ortak ozellikler tutulur. Varyant seviyesinde ise barkod, fiyat, stok, teslimat gibi varyant-ozel bilgiler yer alir.

### Ornek Payload'lar

**v2 Urun Yaratma:**
```json
{
    "items": [{
        "barcode": "TEST-001",
        "title": "Ornek Urun",
        "description": "<p>Aciklama</p>",
        "productMainId": "MAIN-001",
        "brandId": 1791,
        "categoryId": 411,
        "quantity": 100,
        "stockCode": "STK-001",
        "dimensionalWeight": 2,
        "listPrice": 199.99,
        "salePrice": 149.99,
        "vatRate": 10,
        "deliveryOption": {
            "deliveryDuration": 3
        },
        "images": [{ "url": "https://example.com/img.jpg" }],
        "attributes": [
            { "attributeId": 338, "attributeValueIds": [6980] },
            { "attributeId": 47, "attributeValue": "Ozel Deger" }
        ]
    }]
}
```

**v2 Onayli Urun Filtreleme Yaniti:**
```json
{
    "totalElements": 1,
    "totalPages": 1,
    "page": 0,
    "size": 50,
    "content": [{
        "contentId": 9510902,
        "productMainId": "MAIN-001",
        "brand": { "id": 1791, "name": "Marka" },
        "category": { "id": 411, "name": "Kategori" },
        "title": "Ornek Urun",
        "variants": [{
            "barcode": "TEST-001",
            "onSale": true,
            "price": { "salePrice": 149.99, "listPrice": 199.99 },
            "deliveryOptions": { "deliveryDuration": 3 }
        }]
    }]
}
```

## Proje Yapisi

```
trendyol-satici-api/
├── config.ts              # API bilgileri
├── src/
│   ├── index.ts           # Ana export
│   ├── client.ts          # TrendyolClient sinifi (v1 + v2)
│   ├── types.ts           # TypeScript tipleri (v1 + v2)
│   ├── endpoints.ts       # API endpoint'leri (v1 + v2)
│   └── utils.ts           # Yardimci fonksiyonlar
├── __tests__/
│   ├── endpoints-v2.test.ts  # Endpoint testleri
│   └── client-v2.test.ts     # Client v2 testleri
├── examples/
│   └── v2/
│       ├── urun-yaratma.ts        # v2 urun olusturma ornegi
│       ├── urun-guncelleme.ts     # v2 guncelleme ornekleri
│       ├── urun-filtreleme.ts     # v2 filtreleme ornekleri
│       ├── kategori-ozellikleri.ts # v2 kategori ornegi
│       └── migration-v1-to-v2.ts  # v1->v2 gecis ornegi
├── test.ts                # Legacy test scripti
├── example.ts             # Legacy ornek
└── jest.config.js         # Jest yapilandirmasi
```

## Test

```bash
# Jest testlerini calistir (v2)
npm test

# Legacy testleri calistir (v1)
npm run test:legacy
```

## API Endpoint'leri

| Ortam | URL |
|-------|-----|
| **Production** | `https://apigw.trendyol.com` |
| **Sandbox** | `https://stageapigw.trendyol.com` |

## Kaynaklar

- [Trendyol Developer Portal](https://developers.trendyol.com/)
- [Trendyol Partner Panel](https://partner.trendyol.com/)

## Gelistirici

**Hamza CIFTCI** - hamzaciftci80@gmail.com

## Lisans

MIT License - [LICENSE](LICENSE)

---

<div align="center">

Bu projeyi faydali bulduysaniz yildiz vermeyi unutmayin!

</div>
