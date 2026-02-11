/**
 * Trendyol v2 Kategori Ozellik Listesi ve Deger Sorgulama Ornegi
 *
 * Urun yaratmadan once kategori ozelliklerini ve gecerli degerleri
 * bu servislerle sorgulayip request body'yi doldurmalisiniz.
 *
 * Calistirmak icin:
 *   npx ts-node examples/v2/kategori-ozellikleri.ts
 */

import { TrendyolClient } from '../../src';

const client = new TrendyolClient({
    supplierId: 'SUPPLIER_ID',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
});

async function main() {
    const categoryId = 411; // Ornek kategori ID

    // 1. Kategori ozelliklerini getir (v2)
    console.log('=== KATEGORI OZELLIK LISTESI (v2) ===\n');

    const attrs = await client.getCategoryAttributesV2(categoryId);

    if (!attrs.success || !attrs.data) {
        console.log(`Hata: ${attrs.error}`);
        return;
    }

    console.log(`Kategori: ${attrs.data.displayName} (ID: ${attrs.data.id})`);
    console.log(`Ozellik sayisi: ${attrs.data.categoryAttributes.length}\n`);

    for (const attr of attrs.data.categoryAttributes) {
        const flags = [];
        if (attr.required) flags.push('ZORUNLU');
        if (attr.varianter) flags.push('VARYANT');
        if (attr.slicer) flags.push('DILIMLEYICI');
        if (attr.allowCustom) flags.push('SERBEST_METIN');
        if (attr.allowMultipleAttributeValues) flags.push('COKLU_DEGER');

        console.log(`${attr.attribute.name} (ID: ${attr.attribute.id})`);
        console.log(`  Ozellikler: ${flags.join(', ') || '-'}`);

        // 2. Her ozellik icin gecerli degerleri getir
        if (!attr.allowCustom) {
            const values = await client.getCategoryAttributeValuesV2(
                categoryId,
                attr.attribute.id,
                { size: 5 }
            );

            if (values.success && values.data) {
                console.log(`  Degerler (ilk 5 / ${values.data.totalElements}):`);
                values.data.content.forEach(v => {
                    console.log(`    - ${v.attributeValueName} (ID: ${v.attributeValueId})`);
                });
            }
        } else {
            console.log('  Degerler: Serbest metin (attributeValue alani ile)');
        }
        console.log('');
    }

    // 3. Belirli bir deger arama
    console.log('=== DEGER ARAMA ===\n');

    const search = await client.getCategoryAttributeValuesV2(categoryId, 338, {
        attributeValueName: 'Kirmizi',
        size: 10,
    });

    if (search.success && search.data) {
        console.log(`"Kirmizi" araması: ${search.data.totalElements} sonuc`);
        search.data.content.forEach(v => {
            console.log(`  ${v.attributeValueName} (ID: ${v.attributeValueId})`);
        });
    }
}

main().catch(console.error);
