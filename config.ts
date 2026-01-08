/**
 * Trendyol API Yapılandırma Dosyası
 * 
 * ⚠️ API BİLGİLERİNİZİ SADECE BU DOSYADA GİRİN
 * Tüm proje bu dosyadaki bilgileri kullanacaktır.
 * 
 * API bilgilerinizi almak için:
 * 1. https://partner.trendyol.com adresine giriş yapın
 * 2. Sağ üst köşeden mağaza adınıza tıklayın
 * 3. "Hesap Bilgilerim" > "Entegrasyon Bilgileri"
 */

import { TrendyolConfig } from './src/types';

// ============================================
// ⚠️ API BİLGİLERİNİZİ BURAYA GİRİN
// ============================================

export const API_CONFIG: TrendyolConfig = {
    // Tedarikçi ID'niz (Supplier ID)
    supplierId: 'SUPPLIER_ID_BURAYA',
    
    // API Anahtarınız (API Key)
    apiKey: 'API_KEY_BURAYA',
    
    // API Gizli Anahtarınız (API Secret)
    apiSecret: 'API_SECRET_BURAYA',
    
    // Ortam: 'production' (gerçek) veya 'sandbox' (test)
    environment: 'production'
};

// ============================================
// KONTROL
// ============================================

export function isConfigured(): boolean {
    return (
        API_CONFIG.supplierId !== 'SUPPLIER_ID_BURAYA' &&
        API_CONFIG.apiKey !== 'API_KEY_BURAYA' &&
        API_CONFIG.apiSecret !== 'API_SECRET_BURAYA'
    );
}

export function printConfigWarning(): void {
    console.log('\n⚠️  UYARI: API bilgilerinizi henüz girmediniz!');
    console.log('   config.ts dosyasını düzenleyin.\n');
    console.log('   API bilgilerinizi almak için:');
    console.log('   1. https://partner.trendyol.com adresine giriş yapın');
    console.log('   2. Sağ üst köşeden mağaza adınıza tıklayın');
    console.log('   3. "Hesap Bilgilerim" > "Entegrasyon Bilgileri"\n');
}
