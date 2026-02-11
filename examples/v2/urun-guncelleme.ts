/**
 * Trendyol v2 Urun Guncelleme Ornekleri
 *
 * v2'de 4 farkli guncelleme servisi var:
 * 1. Onaysiz urun guncelleme (tum alanlar)
 * 2. Onayli urun content guncelleme (baslik, aciklama, gorsel, ozellik)
 * 3. Onayli urun varyant guncelleme (stokCode, vatRate, desi vb.)
 * 4. Teslimat bilgisi guncelleme (deliveryOption)
 *
 * Calistirmak icin:
 *   npx ts-node examples/v2/urun-guncelleme.ts
 */

import { TrendyolClient } from '../../src';

const client = new TrendyolClient({
    supplierId: 'SUPPLIER_ID',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
});

async function onaysizUrunGuncelle() {
    console.log('=== ONAYSIZ URUN GUNCELLEME ===\n');

    const result = await client.updateUnapprovedProductV2({
        items: [{
            barcode: 'ORNEK-001-RED',
            title: 'Duzeltilmis Baslik - Spor Ayakkabi',
            description: '<p>Guncellenmis aciklama. Red nedenine gore duzeltildi.</p>',
            images: [
                { url: 'https://example.com/ayakkabi-red-fixed.jpg' },
            ],
            attributes: [
                { attributeId: 338, attributeValueIds: [6980] },
                { attributeId: 343, attributeValueIds: [4872] },
                { attributeId: 47, attributeValue: 'Dogal Deri' },
            ],
        }],
    });

    if (result.success) {
        console.log(`Batch ID: ${result.data?.batchRequestId}`);
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function onayliContentGuncelle() {
    console.log('\n=== ONAYLI URUN CONTENT GUNCELLEME ===\n');

    // Oncelikle contentId'yi bul
    const info = await client.getProductBasicInfoV2('ORNEK-001-RED');
    if (!info.success || !info.data?.contentId) {
        console.log('Content ID bulunamadi.');
        return;
    }

    const contentId = info.data.contentId;
    console.log(`Content ID: ${contentId}`);

    // Content guncelle (baslik, aciklama, gorsel, ozellikler)
    // NOT: barcode, productMainId, brandId, categoryId guncellenemez
    // NOT: Ozellik guncellerken TUM ozellikleri gonderin
    const result = await client.updateApprovedContentV2({
        items: [{
            contentId,
            title: 'Premium Spor Ayakkabi',
            description: '<p>Premium kalite spor ayakkabi. Ortopedik taban.</p>',
            images: [
                { url: 'https://example.com/premium-1.jpg' },
                { url: 'https://example.com/premium-2.jpg' },
                { url: 'https://example.com/premium-3.jpg' },
            ],
        }],
    });

    if (result.success) {
        console.log(`Batch ID: ${result.data?.batchRequestId}`);
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function onayliVaryantGuncelle() {
    console.log('\n=== ONAYLI URUN VARYANT GUNCELLEME ===\n');

    const result = await client.updateApprovedVariantV2({
        items: [
            {
                barcode: 'ORNEK-001-RED',
                stockCode: 'YENi-STK-RED-42',
                vatRate: 20,
                dimensionalWeight: 2.5,
            },
            {
                barcode: 'ORNEK-001-BLUE',
                stockCode: 'YENI-STK-BLUE-42',
                vatRate: 20,
            },
        ],
    });

    if (result.success) {
        console.log(`Batch ID: ${result.data?.batchRequestId}`);
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function teslimatBilgisiGuncelle() {
    console.log('\n=== TESLIMAT BILGISI GUNCELLEME ===\n');

    const result = await client.updateDeliveryOptionV2({
        items: [{
            barcode: 'ORNEK-001-RED',
            deliveryOption: {
                deliveryDuration: 1,
                fastDeliveryType: 'SAME_DAY_SHIPPING',
            },
        }],
    });

    if (result.success) {
        console.log(`Batch ID: ${result.data?.batchRequestId}`);
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function main() {
    await onaysizUrunGuncelle();
    await onayliContentGuncelle();
    await onayliVaryantGuncelle();
    await teslimatBilgisiGuncelle();
}

main().catch(console.error);
