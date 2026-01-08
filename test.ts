/**
 * Trendyol API Client Test Script
 * 
 * ⚠️ API bilgilerinizi config.ts dosyasına girin, buraya değil!
 */

import { TrendyolClient } from './src';
import { API_CONFIG, isConfigured, printConfigWarning } from './config';

// Config'den client oluştur
const client = new TrendyolClient(API_CONFIG);

// ============================================
// TEST FONKSİYONLARI
// ============================================

async function testConnection() {
    console.log('\n🔌 BAĞLANTI TESTİ');
    console.log('─'.repeat(50));
    
    const isConnected = await client.testConnection();
    console.log(`Bağlantı: ${isConnected ? '✅ Başarılı' : '❌ Başarısız'}`);
    
    return isConnected;
}

async function testGetProducts() {
    console.log('\n📦 ÜRÜNLER (3 adet)');
    console.log('─'.repeat(50));
    
    const response = await client.getProducts({ size: 3 });
    
    if (response.success && response.data) {
        console.log(`✅ ${response.data.length} ürün bulundu\n`);
        
        response.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title}`);
            console.log(`   Marka: ${product.brand}`);
            console.log(`   Barkod: ${product.barcode}`);
            console.log(`   Fiyat: ${product.salePrice} TL`);
            console.log(`   Onaylı: ${product.approved ? 'Evet' : 'Hayır'}`);
            console.log('');
        });
    } else {
        console.log(`❌ Hata: ${response.error}`);
    }
    
    return response;
}

async function testGetOrders() {
    console.log('\n📋 SİPARİŞLER (Son 7 gün, 3 adet)');
    console.log('─'.repeat(50));
    
    const response = await client.getRecentOrders(7, 3);
    
    if (response.success && response.data) {
        console.log(`✅ ${response.data.length} sipariş bulundu\n`);
        
        response.data.forEach((order, index) => {
            const date = order.orderDate ? new Date(order.orderDate).toLocaleDateString('tr-TR') : 'N/A';
            console.log(`${index + 1}. Sipariş #${order.orderNumber || order.shipmentPackageId}`);
            console.log(`   Tarih: ${date}`);
            console.log(`   Durum: ${order.status || order.shipmentPackageStatus}`);
            console.log(`   Toplam: ${order.packageTotalPrice || order.totalPrice} TL`);
            console.log('');
        });
    } else {
        console.log(`❌ Hata: ${response.error}`);
    }
    
    return response;
}

async function testGetQuestions() {
    console.log('\n❓ MÜŞTERİ SORULARI');
    console.log('─'.repeat(50));
    
    const response = await client.getQuestions({ size: 3 });
    
    if (response.success && response.data) {
        console.log(`✅ ${response.data.length} soru bulundu\n`);
        
        if (response.data.length === 0) {
            console.log('   Henüz soru yok.');
        } else {
            response.data.forEach((question, index) => {
                console.log(`${index + 1}. Soru ID: ${question.id}`);
                console.log(`   Ürün: ${question.productName || 'N/A'}`);
                console.log(`   Soru: ${question.text || question.questionText || 'N/A'}`);
                console.log(`   Durum: ${question.status}`);
                console.log('');
            });
        }
    } else {
        console.log(`❌ Hata: ${response.error}`);
    }
    
    return response;
}

async function testGetBrands() {
    console.log('\n🏷️ MARKALAR (5 adet)');
    console.log('─'.repeat(50));
    
    const response = await client.getBrands({ size: 5 });
    
    if (response.success && response.data) {
        console.log(`✅ ${response.data.length} marka bulundu\n`);
        
        response.data.slice(0, 5).forEach((brand, index) => {
            console.log(`${index + 1}. ${brand.name} (ID: ${brand.id})`);
        });
    } else {
        console.log(`❌ Hata: ${response.error}`);
    }
    
    return response;
}

// ============================================
// ANA TEST RUNNER
// ============================================

async function runAllTests() {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║          TRENDYOL SATICI API TEST                        ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    
    console.log(`\n📋 Satıcı ID: ${client.getSupplierId()}`);
    console.log(`🌐 Ortam: ${client.getEnvironment()}`);
    console.log(`🔗 Base URL: ${client.getBaseUrl()}`);
    
    // API bilgileri kontrol
    if (!isConfigured()) {
        printConfigWarning();
        return;
    }
    
    const connected = await testConnection();
    
    if (!connected) {
        console.log('\n❌ Bağlantı başarısız, testler durduruluyor.');
        console.log('   config.ts dosyasındaki API bilgilerinizi kontrol edin.');
        return;
    }
    
    await testGetProducts();
    await testGetOrders();
    await testGetQuestions();
    await testGetBrands();
    
    console.log('\n' + '═'.repeat(60));
    console.log('✅ TÜM TESTLER TAMAMLANDI');
    console.log('═'.repeat(60) + '\n');
}

runAllTests().catch(console.error);
