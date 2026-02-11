/**
 * v1 -> v2 Migration Ornegi
 *
 * Bu dosya, mevcut v1 kodunuzu v2'ye nasil gecireceginizi gosterir.
 * v1 servisleri 10 Agustos 2026'da kapanacak.
 *
 * Calistirmak icin:
 *   npx ts-node examples/v2/migration-v1-to-v2.ts
 */

import { TrendyolClient } from '../../src';

const client = new TrendyolClient({
    supplierId: 'SUPPLIER_ID',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
});

async function main() {
    // ============================================
    // URUN LISTELEME: v1 vs v2
    // ============================================

    // ESKI (v1) - deprecated, 10 Agustos 2026'da kapanacak
    // const products = await client.getProducts({ approved: true, size: 50 });

    // YENI (v2) - Onayli urunler icin
    const approvedProducts = await client.getApprovedProductsV2({
        status: 'onSale',
        size: 50,
    });

    // YENI (v2) - Onaysiz urunler icin
    const unapprovedProducts = await client.getUnapprovedProductsV2({
        status: 'rejected',
        size: 50,
    });

    // ============================================
    // BARKOD ILE URUN SORGULAMA: v1 vs v2
    // ============================================

    // ESKI (v1)
    // const product = await client.getProductByBarcode('1234567890');

    // YENI (v2) - Temel bilgiler (onay durumu, contentId)
    const basicInfo = await client.getProductBasicInfoV2('1234567890');

    if (basicInfo.success && basicInfo.data) {
        console.log('v2 Temel bilgi:');
        console.log(`  Onay: ${basicInfo.data.approved}`);
        console.log(`  Content ID: ${basicInfo.data.contentId}`);

        // Content ID ile detayli bilgi almak icin approved filter kullanin
        if (basicInfo.data.approved && basicInfo.data.contentId) {
            const details = await client.getApprovedProductsV2({
                barcode: '1234567890',
                size: 1,
            });
            if (details.success && details.data?.content.length) {
                const content = details.data.content[0];
                console.log(`  Baslik: ${content.title}`);
                console.log(`  Varyant sayisi: ${content.variants?.length}`);
            }
        }
    }

    // ============================================
    // KATEGORI OZELLIKLERI: v1 vs v2
    // ============================================

    // ESKI (v1)
    // const attrs = await client.getCategoryAttributes(411);

    // YENI (v2) - Daha detayli: varianter, slicer, allowMultipleAttributeValues
    const attrsV2 = await client.getCategoryAttributesV2(411);
    if (attrsV2.success && attrsV2.data) {
        console.log('\nv2 Kategori ozellikleri:');
        attrsV2.data.categoryAttributes.forEach(attr => {
            console.log(`  ${attr.attribute.name}: zorunlu=${attr.required}, varyant=${attr.varianter}, slicer=${attr.slicer}`);
        });
    }

    // YENI (v2) - Ozellik degerleri icin ayri servis
    const values = await client.getCategoryAttributeValuesV2(411, 338, {
        size: 100,
    });

    // ============================================
    // ONEMLI FARKLAR
    // ============================================
    console.log('\n=== v1 vs v2 TEMEL FARKLAR ===');
    console.log('1. v1: Barkod bazli yapı  →  v2: Content bazlı yapı (contentId)');
    console.log('2. v1: Tek urun listesi   →  v2: Ayrı onaylı/onaysız servisler');
    console.log('3. v1: Tek guncelleme      →  v2: Content / Varyant / Teslimat ayrı güncelleme');
    console.log('4. v1: Temel ozellikler    →  v2: varianter, slicer, allowMultipleAttributeValues');
    console.log('5. v1: Sayfa bazlı         →  v2: nextPageToken ile 10.000+ kayıt desteği');
}

main().catch(console.error);
