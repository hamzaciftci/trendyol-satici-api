/**
 * Trendyol v2 Urun Filtreleme Ornekleri
 *
 * v2'de 3 farkli filtreleme servisi var:
 * 1. Temel bilgiler (barkod ile tek urun)
 * 2. Onaysiz urunler (red edilen, onay bekleyen)
 * 3. Onayli urunler (content-based yapi, varyantlarla birlikte)
 *
 * Calistirmak icin:
 *   npx ts-node examples/v2/urun-filtreleme.ts
 */

import { TrendyolClient } from '../../src';

const client = new TrendyolClient({
    supplierId: 'SUPPLIER_ID',
    apiKey: 'API_KEY',
    apiSecret: 'API_SECRET',
});

async function temelBilgiSorgula() {
    console.log('=== TEMEL BILGI SORGULAMA (v2) ===\n');

    const result = await client.getProductBasicInfoV2('1234567890');

    if (result.success && result.data) {
        const info = result.data;
        console.log(`Barkod: ${info.barcode}`);
        console.log(`Onayli: ${info.approved}`);
        console.log(`Onay Tarihi: ${info.approvedDate ? new Date(info.approvedDate).toLocaleString('tr-TR') : '-'}`);
        console.log(`Arsivlenmis: ${info.archived}`);
        console.log(`Content ID: ${info.contentId}`);
        console.log(`Listing ID: ${info.listingId}`);
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function onaysizUrunleriListele() {
    console.log('\n=== ONAYSIZ URUNLER (v2) ===\n');

    // Reddedilen urunleri listele
    const rejected = await client.getUnapprovedProductsV2({
        status: 'rejected',
        size: 10,
        dateQueryType: 'LAST_MODIFIED_DATE',
    });

    if (rejected.success && rejected.data) {
        console.log(`Toplam reddedilen: ${rejected.data.totalElements}`);
        console.log(`Sayfa: ${rejected.data.page + 1} / ${rejected.data.totalPages}\n`);

        rejected.data.content.forEach((product, i) => {
            console.log(`${i + 1}. ${product.title}`);
            console.log(`   Barkod: ${product.barcode}`);
            console.log(`   Marka: ${product.brand?.name}`);
            console.log(`   Fiyat: ${product.salePrice} TL`);

            if (product.rejectReasonDetails?.length) {
                console.log('   Red Nedenleri:');
                product.rejectReasonDetails.forEach(r => {
                    console.log(`     - ${r.rejectReason}: ${r.rejectReasonDetail}`);
                });
            }
            console.log('');
        });

        // 10.000+ kayit icin nextPageToken kullanimi
        if (rejected.data.nextPageToken) {
            console.log('Sonraki sayfa icin nextPageToken:', rejected.data.nextPageToken);

            const nextPage = await client.getUnapprovedProductsV2({
                size: 10,
                nextPageToken: rejected.data.nextPageToken,
            });
            // nextPage.data?.content ...
        }
    }

    // Onay bekleyenleri listele
    const pending = await client.getUnapprovedProductsV2({
        status: 'pendingApproval',
        size: 5,
    });

    if (pending.success && pending.data) {
        console.log(`Onay bekleyen: ${pending.data.totalElements} urun`);
    }
}

async function onayliUrunleriListele() {
    console.log('\n=== ONAYLI URUNLER - CONTENT-BASED (v2) ===\n');

    const result = await client.getApprovedProductsV2({
        status: 'onSale',
        size: 5,
        dateQueryType: 'CONTENT_MODIFIED_DATE',
    });

    if (result.success && result.data) {
        console.log(`Toplam content: ${result.data.totalElements}`);
        console.log(`Sayfa: ${result.data.page + 1} / ${result.data.totalPages}\n`);

        result.data.content.forEach((content, i) => {
            console.log(`${i + 1}. [Content ID: ${content.contentId}] ${content.title}`);
            console.log(`   Marka: ${content.brand?.name}`);
            console.log(`   Kategori: ${content.category?.name}`);

            // Content ozellikleri
            if (content.attributes?.length) {
                console.log('   Ozellikler:');
                content.attributes.forEach(attr => {
                    const values = attr.attributeValues.map(v => v.attributeValue).join(', ');
                    console.log(`     ${attr.attributeName}: ${values}`);
                });
            }

            // Varyantlar
            if (content.variants?.length) {
                console.log(`   Varyantlar (${content.variants.length}):`);
                content.variants.forEach(variant => {
                    const attrs = variant.attributes?.map(a => `${a.attributeName}: ${a.attributeValue}`).join(', ');
                    console.log(`     - ${variant.barcode} | ${attrs}`);
                    console.log(`       Fiyat: ${variant.price?.salePrice} TL | Stok Kodu: ${variant.stockCode}`);
                    console.log(`       Satista: ${variant.onSale} | Arsiv: ${variant.archived} | Kilitli: ${variant.locked}`);

                    if (variant.deliveryOptions) {
                        console.log(`       Teslimat: ${variant.deliveryOptions.deliveryDuration} gun`);
                        if (variant.deliveryOptions.fastDeliveryOptions?.length) {
                            variant.deliveryOptions.fastDeliveryOptions.forEach(fdo => {
                                console.log(`       Hizli: ${fdo.deliveryOptionType} (kesim: ${fdo.deliveryDailyCutOffHour})`);
                            });
                        }
                    }
                });
            }
            console.log('');
        });
    } else {
        console.log(`Hata: ${result.error}`);
    }
}

async function main() {
    await temelBilgiSorgula();
    await onaysizUrunleriListele();
    await onayliUrunleriListele();
}

main().catch(console.error);
