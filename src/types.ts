/**
 * Trendyol API TypeScript Types
 * 
 * @author Hamza ÇİFTÇİ <hamzaciftci80@gmail.com>
 * @license MIT
 * @see https://github.com/hamzaciftci/trendyol-api-client
 * 
 * Son güncelleme: Trendyol API değişiklikleri (2 Şubat 2026)
 */

// ============================================
// CREDENTIALS & CONFIG
// ============================================

export interface TrendyolConfig {
    supplierId: string;
    apiKey: string;
    apiSecret: string;
    environment?: 'production' | 'sandbox';
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface TrendyolProduct {
    id?: string;
    title?: string;
    description?: string;
    brand?: string;
    brandId?: number;
    category?: string;
    categoryName?: string;
    categoryId?: number;
    barcode?: string;
    stockCode?: string;
    productMainId?: string;
    salePrice?: number;
    listPrice?: number;
    quantity?: number;
    approved?: boolean;
    archived?: boolean;
    onSale?: boolean;
    rejected?: boolean;
    blacklisted?: boolean;
    images?: ProductImage[];
    attributes?: ProductAttribute[];
    [key: string]: any;
}

export interface ProductImage {
    url: string;
}

export interface ProductAttribute {
    attributeId: number;
    attributeName: string;
    attributeValueId?: number;
    attributeValue: string;
}

export interface ProductFilters {
    page?: number;
    size?: number;
    approved?: boolean;
    archived?: boolean;
    brandIds?: string;
    barcode?: string;
    stockCode?: string;
    startDate?: string | number;
    endDate?: string | number;
    dateQueryType?: 'CREATED_DATE' | 'LAST_MODIFIED_DATE';
    supplierId?: number;
    productMainId?: string;
    onSale?: boolean;
    rejected?: boolean;
    blacklisted?: boolean;
}

// ============================================
// ORDER TYPES
// Güncelleme: Trendyol API değişiklikleri (2 Şubat 2026)
// ============================================

/**
 * Trendyol Sipariş/Paket Arayüzü
 * 
 * İsimlendirme değişiklikleri (eski → yeni):
 * - id → shipmentPackageId
 * - grossAmount → packageGrossAmount
 * - totalDiscount → packageSellerDiscount
 * - totalTyDiscount → packageTyDiscount
 * - totalPrice → packageTotalPrice
 */
export interface TrendyolOrder {
    /** Paket ID (eski: id) */
    shipmentPackageId?: number;
    orderNumber?: string;
    
    /** Satıcı ID (eski: merchantId) */
    sellerId?: number;
    
    customerId?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    orderDate?: number;
    status?: string;
    shipmentPackageStatus?: string;
    
    /** Paket brüt tutarı (eski: grossAmount) */
    packageGrossAmount?: number;
    
    /** Paket satıcı indirimi (eski: totalDiscount) */
    packageSellerDiscount?: number;
    
    /** Paket Trendyol indirimi (eski: totalTyDiscount) */
    packageTyDiscount?: number;
    
    /** Paket toplam indirimi (packageSellerDiscount + packageTyDiscount) - YENİ */
    packageTotalDiscount?: number;
    
    /** 
     * İndirim görüntüleme bilgileri (YENİ - Ocak 2026)
     * Siparişte uygulanan indirimlerin detay bilgilerini içerir.
     * @see https://developers.trendyol.com/docs/marketplace/siparis-entegrasyonu/siparis-paketlerini-cekme
     */
    discountDisplays?: DiscountDisplay[];
    
    /** Paket toplam fiyatı (eski: totalPrice) */
    packageTotalPrice?: number;
    
    currencyCode?: string;
    deliveryType?: string;
    cargoTrackingNumber?: string;
    cargoProviderName?: string;
    
    /** İptal eden (YENİ) */
    cancelledBy?: string;
    
    /** İptal nedeni (YENİ) */
    cancelReason?: string;
    
    /** İptal nedeni kodu (YENİ) */
    cancelReasonCode?: string;
    
    lines?: TrendyolOrderLine[];
    shipmentAddress?: ShipmentAddress;
    invoiceAddress?: InvoiceAddress;
    packageHistories?: PackageHistory[];
    
    // Backward compatibility için eski alan isimleri (2 Şubat 2026'da kaldırılacak)
    /** @deprecated shipmentPackageId kullanın */
    id?: number;
    /** @deprecated sellerId kullanın */
    merchantId?: number;
    /** @deprecated packageGrossAmount kullanın */
    grossAmount?: number;
    /** @deprecated packageSellerDiscount kullanın */
    totalDiscount?: number;
    /** @deprecated packageTyDiscount kullanın */
    totalTyDiscount?: number;
    /** @deprecated packageTotalPrice kullanın */
    totalPrice?: number;
    
    [key: string]: any;
}

/**
 * Sipariş Satırı Arayüzü
 * 
 * İsimlendirme değişiklikleri (eski → yeni):
 * - id → lineId
 * - amount → lineGrossAmount
 * - discount → lineSellerDiscount
 * - tyDiscount → lineTyDiscount
 * - lineItemDiscount → lineItemSellerDiscount
 * - price → lineUnitPrice
 * - merchantSku → stockCode
 * - productCode → contentId
 * - vatBaseAmount → vatRate
 */
export interface TrendyolOrderLine {
    /** Satır ID (eski: id) */
    lineId?: number;
    
    productId?: string;
    productName?: string;
    quantity?: number;
    
    /** Satır brüt tutarı (eski: amount) */
    lineGrossAmount?: number;
    
    /** Satır birim fiyatı (eski: price) */
    lineUnitPrice?: number;
    
    /** Satır satıcı indirimi (eski: discount) */
    lineSellerDiscount?: number;
    
    /** Satır Trendyol indirimi (eski: tyDiscount) */
    lineTyDiscount?: number;
    
    /** Satır toplam indirimi (lineSellerDiscount + lineTyDiscount) - YENİ */
    lineTotalDiscount?: number;
    
    /** Satır öğe satıcı indirimi (eski: lineItemDiscount) */
    lineItemSellerDiscount?: number;
    
    barcode?: string;
    
    /** Stok kodu (eski: merchantSku) */
    stockCode?: string;
    
    /** İçerik ID (eski: productCode) */
    contentId?: string;
    
    /** KDV oranı (eski: vatBaseAmount) */
    vatRate?: number;
    
    productSize?: string;
    productColor?: string;
    orderLineItemStatusName?: string;
    
    /** Satıcı ID (eski: merchantId) */
    sellerId?: number;
    
    // Backward compatibility için eski alan isimleri (2 Şubat 2026'da kaldırılacak)
    /** @deprecated lineId kullanın */
    id?: number;
    /** @deprecated lineGrossAmount kullanın */
    amount?: number;
    /** @deprecated lineUnitPrice kullanın */
    price?: number;
    /** @deprecated lineSellerDiscount kullanın */
    discount?: number;
    /** @deprecated lineTyDiscount kullanın */
    tyDiscount?: number;
    /** @deprecated lineItemSellerDiscount kullanın */
    lineItemDiscount?: number;
    /** @deprecated stockCode kullanın */
    merchantSku?: string;
    /** @deprecated sellerId kullanın */
    merchantId?: number;
    /** @deprecated contentId kullanın */
    productCode?: string;
    /** @deprecated vatRate kullanın */
    vatBaseAmount?: number;
    
    [key: string]: any;
}

/**
 * İndirim Detayları
 */
export interface DiscountDetails {
    lineItemPrice?: number;
    lineItemDiscount?: number;
    lineItemSellerDiscount?: number;
    lineItemTyDiscount?: number;
}

/**
 * İndirim Görüntüleme Bilgisi (YENİ - Ocak 2026)
 * 
 * Siparişte uygulanan indirimlerin detay bilgilerini içerir.
 * getShipmentPackages servisi ve webhook model üzerinden döner.
 * 
 * @see https://developers.trendyol.com/docs/marketplace/siparis-entegrasyonu/siparis-paketlerini-cekme
 */
export interface DiscountDisplay {
    /** İndirim adı (örn: "Sepette %20 İndirim", "Trendyol Plus'a Özel Fiyat") */
    displayName?: string;
    
    /** İndirim tutarı */
    discountAmount?: number;
}

export interface ShipmentAddress {
    id?: number;
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    countryCode?: string;
    fullAddress?: string;
    fullName?: string;
}

export interface InvoiceAddress {
    id?: number;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    district?: string;
    postalCode?: string;
    countryCode?: string;
    fullAddress?: string;
    fullName?: string;
    taxNumber?: string;
    taxOffice?: string;
}

export interface PackageHistory {
    createdDate?: number;
    status?: string;
}

export interface OrderFilters {
    page?: number;
    size?: number;
    startDate?: string | number;
    endDate?: string | number;
    status?: string;
    orderByField?: string;
    orderByDirection?: 'ASC' | 'DESC';
    orderNumber?: string;
    shipmentPackageIds?: number;
}

// ============================================
// BRAND TYPES
// ============================================

export interface TrendyolBrand {
    id: number;
    name: string;
}

export interface BrandFilters {
    page?: number;
    size?: number;
    name?: string;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface TrendyolCategory {
    id: number;
    name: string;
    parentId?: number;
    subCategories?: TrendyolCategory[];
}

export interface CategoryAttribute {
    id: number;
    name: string;
    required: boolean;
    allowCustom: boolean;
    attributeValues?: CategoryAttributeValue[];
}

export interface CategoryAttributeValue {
    id: number;
    name: string;
}

// ============================================
// QUESTION TYPES
// ============================================

export interface TrendyolQuestion {
    id: string;
    customerId?: string;
    customerName?: string;
    text?: string;
    questionText?: string;
    answerText?: string;
    productId?: string;
    productName?: string;
    productMainId?: string;
    barcode?: string;
    creationDate?: number;
    answerDate?: number;
    status?: QuestionStatus;
    [key: string]: any;
}

export type QuestionStatus = 
    | 'WAITING_FOR_ANSWER' 
    | 'WAITING_FOR_APPROVE' 
    | 'ANSWERED' 
    | 'REPORTED' 
    | 'REJECTED';

export interface QuestionFilters {
    page?: number;
    size?: number;
    startDate?: string | number;
    endDate?: string | number;
    status?: QuestionStatus;
    barcode?: string;
    supplierId?: number;
    orderByField?: 'LastModifiedDate' | 'CreatedDate';
    orderByDirection?: 'ASC' | 'DESC';
}

export interface QuestionAnswer {
    questionId: string;
    text: string;
}

// ============================================
// WEBHOOK TYPES
// ============================================

export interface TrendyolWebhook {
    id?: string;
    url: string;
    username?: string;
    password?: string;
    authenticationType?: 'BASIC_AUTHENTICATION' | 'API_KEY';
    apiKey?: string;
    subscribedStatuses?: WebhookEventType[];
    isActive?: boolean;
    supplierId?: string;
    createdDate?: number;
    lastModifiedDate?: number;
}

export type WebhookEventType =
    | 'CREATED'
    | 'PICKING'
    | 'INVOICED'
    | 'SHIPPED'
    | 'CANCELLED'
    | 'DELIVERED'
    | 'UNDELIVERED'
    | 'RETURNED'
    | 'UNSUPPLIED'
    | 'AWAITING'
    | 'UNPACKED'
    | 'AT_COLLECTION_POINT'
    | 'VERIFIED';

// ============================================
// SHIPMENT TYPES
// ============================================

export interface ShipmentPackage {
    shipmentPackageId?: number;
    status?: string;
    cargoTrackingNumber?: string;
    cargoProviderName?: string;
    lines?: TrendyolOrderLine[];
    
    /** @deprecated shipmentPackageId kullanın */
    id?: number;
}

export interface UpdateTrackingRequest {
    shipmentPackageId: number;
    trackingNumber: string;
}

export interface UpdateStatusRequest {
    lines: { lineId: number; quantity: number }[];
    status: 'Picking' | 'Invoiced' | 'Shipped' | 'Cancelled' | 'UnSupplied';
}

// ============================================
// CLAIMS (İADE) TYPES
// Güncelleme: 2 Şubat 2026 API değişiklikleri
// İsimlendirme değişiklikleri (eski → yeni):
// - content/id → claimId
// - vatBaseAmount → vatRate
// ============================================

/**
 * Trendyol İade/Claim Arayüzü
 */
export interface TrendyolClaim {
    /** Claim ID (eski: content/id) */
    claimId?: number;
    
    orderNumber?: string;
    orderDate?: number;
    customerId?: string;
    customerFirstName?: string;
    customerLastName?: string;
    
    /** Claim oluşturulma tarihi */
    claimDate?: number;
    
    /** Claim durumu */
    claimStatus?: string;
    
    /** Claim tipi */
    claimType?: string;
    
    /** İade nedeni */
    claimReason?: string;
    
    /** İade nedeni kodu */
    claimReasonCode?: string;
    
    /** Claim satırları */
    claimItems?: TrendyolClaimItem[];
    
    /** Kargo takip numarası */
    cargoTrackingNumber?: string;
    
    /** Kargo sağlayıcı adı */
    cargoProviderName?: string;
    
    /** Onay durumu */
    approved?: boolean;
    
    /** İade adresi */
    returnAddress?: ShipmentAddress;
    
    // Backward compatibility için eski alan isimleri (2 Şubat 2026'da kaldırılacak)
    /** @deprecated claimId kullanın */
    id?: number;
    
    [key: string]: any;
}

/**
 * Claim Satırı Arayüzü
 */
export interface TrendyolClaimItem {
    /** Satır ID */
    lineId?: number;
    
    productId?: string;
    productName?: string;
    barcode?: string;
    
    /** Stok kodu (eski: merchantSku) */
    stockCode?: string;
    
    /** İçerik ID (eski: productCode) */
    contentId?: string;
    
    quantity?: number;
    
    /** Birim fiyat */
    lineUnitPrice?: number;
    
    /** Brüt tutar */
    lineGrossAmount?: number;
    
    /** KDV oranı (eski: vatBaseAmount) */
    vatRate?: number;
    
    /** Claim item durumu */
    claimItemStatus?: string;
    
    /** İade nedeni */
    claimItemReason?: string;
    
    productSize?: string;
    productColor?: string;
    
    // Backward compatibility için eski alan isimleri (2 Şubat 2026'da kaldırılacak)
    /** @deprecated stockCode kullanın */
    merchantSku?: string;
    /** @deprecated contentId kullanın */
    productCode?: string;
    /** @deprecated vatRate kullanın */
    vatBaseAmount?: number;
    
    [key: string]: any;
}

/**
 * Claim Filtreleri
 */
export interface ClaimFilters {
    page?: number;
    size?: number;
    startDate?: string | number;
    endDate?: string | number;
    claimStatus?: string;
    orderNumber?: string;
    claimIds?: string;
    orderByField?: string;
    orderByDirection?: 'ASC' | 'DESC';
}

/**
 * Claim Issue Reasons (İade Nedenleri)
 */
export interface ClaimIssueReason {
    id: number;
    name: string;
    code?: string;
}

// ============================================
// FINANCE TYPES (Cari Hesap Ekstresi)
// Güncelleme: 29 Ocak 2026 - transactionTypes ve paymentDate parametreleri eklendi
// @see https://developers.trendyol.com/docs/cari-hesap-ekstresi-entegrasyonu
// ============================================

/**
 * Settlements İşlem Türleri
 */
export type SettlementTransactionType =
    | 'Sale'
    | 'Return'
    | 'Discount'
    | 'DiscountCancel'
    | 'Coupon'
    | 'CouponCancel'
    | 'ProvisionPositive'
    | 'ProvisionNegative'
    | 'SellerRevenuePositive'
    | 'SellerRevenueNegative'
    | 'CommissionPositive'
    | 'CommissionNegative'
    | 'CommissionPositiveCancel'
    | 'CommissionNegativeCancel';

/**
 * OtherFinancials İşlem Türleri
 */
export type OtherFinancialsTransactionType =
    | 'CashAdvance'
    | 'WireTransfer'
    | 'IncomingTransfer'
    | 'ReturnInvoice'
    | 'CommissionAgreementInvoice'
    | 'PaymentOrder'
    | 'DeductionInvoices'
    | 'FinancialItem'
    | 'Stoppage';

/**
 * Settlements Filtreleri
 *
 * @example
 * ```typescript
 * // Tek işlem türü ile sorgulama
 * await client.getSettlements({
 *     transactionType: 'Sale',
 *     startDate: 1706745600000,
 *     endDate: 1707004800000
 * });
 *
 * // Birden fazla işlem türü ile sorgulama (YENİ - 29 Ocak 2026)
 * await client.getSettlements({
 *     transactionTypes: ['Sale', 'Return', 'Discount'],
 *     startDate: 1706745600000,
 *     endDate: 1707004800000,
 *     paymentDate: 1707091200000
 * });
 * ```
 */
export interface SettlementsFilters {
    /** Tek işlem türü (transactionTypes ile birlikte kullanılmaz) */
    transactionType?: SettlementTransactionType;

    /**
     * Birden fazla işlem türü (YENİ - 29 Ocak 2026)
     * Tek istekte birden fazla işlem türüne ait muhasebe kayıtlarını listeleyebilirsiniz.
     */
    transactionTypes?: SettlementTransactionType[];

    /** Başlangıç tarihi (timestamp - milisaniye) - Zorunlu */
    startDate: number;

    /** Bitiş tarihi (timestamp - milisaniye) - Zorunlu, max 15 gün aralık */
    endDate: number;

    /**
     * Ödemeye girebileceği en erken tarih (YENİ - 29 Ocak 2026)
     * Muhasebe kayıtlarını bu filtre ile sorgulayabilirsiniz.
     */
    paymentDate?: number;

    /** Sayfa numarası */
    page?: number;

    /** Sayfa boyutu (500 veya 1000, varsayılan 500) */
    size?: 500 | 1000;
}

/**
 * OtherFinancials Filtreleri
 */
export interface OtherFinancialsFilters {
    /** Tek işlem türü (transactionTypes ile birlikte kullanılmaz) */
    transactionType?: OtherFinancialsTransactionType;

    /**
     * Birden fazla işlem türü (YENİ - 29 Ocak 2026)
     */
    transactionTypes?: OtherFinancialsTransactionType[];

    /** Başlangıç tarihi (timestamp - milisaniye) - Zorunlu */
    startDate: number;

    /** Bitiş tarihi (timestamp - milisaniye) - Zorunlu, max 15 gün aralık */
    endDate: number;

    /**
     * Ödemeye girebileceği en erken tarih (YENİ - 29 Ocak 2026)
     */
    paymentDate?: number;

    /** Sayfa numarası */
    page?: number;

    /** Sayfa boyutu (500 veya 1000, varsayılan 500) */
    size?: 500 | 1000;
}

/**
 * Settlement Kaydı
 */
export interface SettlementRecord {
    /** İşlem tarihi */
    transactionDate?: number;

    /** Barkod */
    barcode?: string;

    /** İşlem türü */
    transactionType?: string;

    /** Borç tutarı */
    debt?: number;

    /** Alacak tutarı */
    credit?: number;

    /** Komisyon tutarı */
    commissionAmount?: number;

    /** Satıcı geliri */
    sellerRevenue?: number;

    /** Sipariş numarası */
    orderNumber?: string;

    /** Ödeme emri ID */
    paymentOrderId?: number;

    /** Paket ID */
    shipmentPackageId?: number;

    /** Ödeme tarihi */
    paymentDate?: number;

    [key: string]: any;
}

/**
 * OtherFinancials Kaydı
 */
export interface OtherFinancialsRecord {
    /** İşlem tarihi */
    transactionDate?: number;

    /** İşlem türü */
    transactionType?: string;

    /** Borç tutarı */
    debt?: number;

    /** Alacak tutarı */
    credit?: number;

    /** Açıklama */
    description?: string;

    /** Ödeme emri ID */
    paymentOrderId?: number;

    /** Ödeme tarihi */
    paymentDate?: number;

    [key: string]: any;
}

// ============================================
// KALDIRILAN ALANLAR (2 Şubat 2026'dan itibaren)
// Bu alanlar artık API response'larında yer almayacak:
// - sku
// - scheduledDeliveryStoreId
// - agreedDeliveryDateExtendible
// - extendedAgreedDeliveryDate
// - agreedDeliveryExtensionEndDate
// - agreedDeliveryExtensionStartDate
// - groupDeal
// ============================================
