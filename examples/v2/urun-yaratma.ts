/**
 * Trendyol v2 Urun Yaratma Ornegi
 *
 * Content-based yapida urun olusturma.
 * Ayni productMainId ile birden fazla barcode gondererek varyant olusturabilirsiniz.
 *
 * Calistirmak icin:
 *   npx ts-node examples/v2/urun-yaratma.ts
 */

import { TrendyolClient } from '../../src';
import type { CreateProductV2Request } from '../../src/types';

const client = new TrendyolClient({
    supplierId: 'SUPPLIER_ID',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
    environment: 'production', // Test icin 'sandbox' kullanin
});

async function main() {
    // 1. Kategori ozelliklerini getir (v2)
    console.log('Kategori ozellikleri aliniyor...');
    const attrs = await client.getCategoryAttributesV2(411);
    if (attrs.success && attrs.data) {
        console.log(`Kategori: ${attrs.data.displayName}`);
        attrs.data.categoryAttributes.forEach(attr => {
            console.log(`  - ${attr.attribute.name} (Zorunlu: ${attr.required}, Varyant: ${attr.varianter})`);
        });
    }

    // 2. Ozellik degerlerini getir (v2)
    console.log('\nRenk degerleri aliniyor...');
    const colorValues = await client.getCategoryAttributeValuesV2(411, 338, { size: 10 });
    if (colorValues.success && colorValues.data) {
        colorValues.data.content.forEach(v => {
            console.log(`  - ${v.attributeValueName} (ID: ${v.attributeValueId})`);
        });
    }

    // 3. Urun olustur (v2)
    const request: CreateProductV2Request = {
        items: [
            // Varyant 1: Kirmizi
            {
                barcode: 'ORNEK-001-RED',
                title: 'Ornek Spor Ayakkabi - Kirmizi',
                description: '<p>Yuksek kaliteli spor ayakkabi. Rahat taban, nefes alan kumas.</p>',
                productMainId: 'ORNEK-AYAKKABI-001', // Ayni productMainId = ayni content
                brandId: 1791,
                categoryId: 411,
                quantity: 100,
                stockCode: 'STK-RED-42',
                dimensionalWeight: 2,
                listPrice: 599.99,
                salePrice: 449.99,
                vatRate: 10,
                deliveryOption: {
                    deliveryDuration: 3,
                },
                images: [
                    { url: 'https://example.com/ayakkabi-red-1.jpg' },
                    { url: 'https://example.com/ayakkabi-red-2.jpg' },
                ],
                attributes: [
                    { attributeId: 338, attributeValueIds: [6980] },  // Renk: Kirmizi
                    { attributeId: 343, attributeValueIds: [4872] },  // Beden: 42
                    { attributeId: 47, attributeValue: 'Suni Deri' }, // Materyal (serbest metin)
                ],
            },
            // Varyant 2: Mavi (ayni content altinda)
            {
                barcode: 'ORNEK-001-BLUE',
                title: 'Ornek Spor Ayakkabi - Mavi',
                description: '<p>Yuksek kaliteli spor ayakkabi. Rahat taban, nefes alan kumas.</p>',
                productMainId: 'ORNEK-AYAKKABI-001', // Ayni productMainId
                brandId: 1791,
                categoryId: 411,
                quantity: 75,
                stockCode: 'STK-BLUE-42',
                dimensionalWeight: 2,
                listPrice: 599.99,
                salePrice: 449.99,
                vatRate: 10,
                deliveryOption: {
                    deliveryDuration: 3,
                },
                images: [
                    { url: 'https://example.com/ayakkabi-blue-1.jpg' },
                    { url: 'https://example.com/ayakkabi-blue-2.jpg' },
                ],
                attributes: [
                    { attributeId: 338, attributeValueIds: [6981] },  // Renk: Mavi
                    { attributeId: 343, attributeValueIds: [4872] },  // Beden: 42
                    { attributeId: 47, attributeValue: 'Suni Deri' }, // Materyal
                ],
            },
        ],
    };

    console.log('\nUrun olusturuluyor (v2)...');
    const result = await client.createProductV2(request);

    if (result.success && result.data) {
        console.log(`Basarili! Batch Request ID: ${result.data.batchRequestId}`);
        console.log('Urun durumunu getBatchRequestResult servisi ile takip edebilirsiniz.');
    } else {
        console.log(`Hata: ${result.error}`);
        console.log('Detay:', JSON.stringify(result.data, null, 2));
    }
}

main().catch(console.error);
