/**
 * Trendyol API Kullanım Örneği
 * 
 * Bu dosya, API'nin nasıl kullanılacağını gösterir.
 * ⚠️ API bilgilerinizi config.ts dosyasına girin!
 */

import { TrendyolClient } from './src';
import { API_CONFIG, isConfigured, printConfigWarning } from './config';

async function main() {
    // Config kontrolü
    if (!isConfigured()) {
        printConfigWarning();
        return;
    }

    // Client oluştur (config.ts'deki bilgiler kullanılır)
    const client = new TrendyolClient(API_CONFIG);

    console.log('🚀 Trendyol API Örneği\n');

    // 1. Bağlantı testi
    const connected = await client.testConnection();
    if (!connected) {
        console.log('❌ API bağlantısı başarısız!');
        return;
    }
    console.log('✅ API bağlantısı başarılı!\n');

    // 2. Ürünleri çek
    console.log('📦 Ürünler çekiliyor...');
    const products = await client.getProducts({ size: 5 });
    if (products.success) {
        console.log(`   ${products.data?.length} ürün bulundu`);
    }

    // 3. Siparişleri çek
    console.log('📋 Son 7 günün siparişleri çekiliyor...');
    const orders = await client.getRecentOrders(7, 5);
    if (orders.success) {
        console.log(`   ${orders.data?.length} sipariş bulundu`);
    }

    // 4. Cevaplanmamış soruları çek
    console.log('❓ Cevaplanmamış sorular çekiliyor...');
    const questions = await client.getUnansweredQuestions(5);
    if (questions.success) {
        console.log(`   ${questions.data?.length} bekleyen soru`);
    }

    console.log('\n✅ Tamamlandı!');
}

main().catch(console.error);
