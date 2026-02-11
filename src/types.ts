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
// Güncelleme: 2 Şubat 2026 API değişiklikleri uygulandı
// ============================================

/**
 * Trendyol Sipariş/Paket Arayüzü
 * @since 2 Şubat 2026 - API alan isimleri güncellendi
 */
export interface TrendyolOrder {
    /** Paket ID */
    shipmentPackageId?: number;
    orderNumber?: string;

    /** Satıcı ID */
    sellerId?: number;
    
    customerId?: string;
    customerFirstName?: string;
    customerLastName?: string;
    customerEmail?: string;
    orderDate?: number;
    status?: string;
    shipmentPackageStatus?: string;
    
    /** Paket brüt tutarı */
    packageGrossAmount?: number;

    /** Paket satıcı indirimi */
    packageSellerDiscount?: number;

    /** Paket Trendyol indirimi */
    packageTyDiscount?: number;

    /** Paket toplam indirimi (packageSellerDiscount + packageTyDiscount) */
    packageTotalDiscount?: number;
    
    /**
     * İndirim görüntüleme bilgileri
     * Siparişte uygulanan indirimlerin detay bilgilerini içerir.
     */
    discountDisplays?: DiscountDisplay[];
    
    /** Paket toplam fiyatı */
    packageTotalPrice?: number;
    
    currencyCode?: string;
    deliveryType?: string;
    cargoTrackingNumber?: string;
    cargoProviderName?: string;
    
    /** İptal eden */
    cancelledBy?: string;

    /** İptal nedeni */
    cancelReason?: string;

    /** İptal nedeni kodu */
    cancelReasonCode?: string;
    
    lines?: TrendyolOrderLine[];
    shipmentAddress?: ShipmentAddress;
    invoiceAddress?: InvoiceAddress;
    packageHistories?: PackageHistory[];

    [key: string]: any;
}

/**
 * Sipariş Satırı Arayüzü
 * @since 2 Şubat 2026 - API alan isimleri güncellendi
 */
export interface TrendyolOrderLine {
    /** Satır ID */
    lineId?: number;
    
    productId?: string;
    productName?: string;
    quantity?: number;
    
    /** Satır brüt tutarı */
    lineGrossAmount?: number;

    /** Satır birim fiyatı */
    lineUnitPrice?: number;

    /** Satır satıcı indirimi */
    lineSellerDiscount?: number;

    /** Satır Trendyol indirimi */
    lineTyDiscount?: number;

    /** Satır toplam indirimi (lineSellerDiscount + lineTyDiscount) */
    lineTotalDiscount?: number;

    /** Satır öğe satıcı indirimi */
    lineItemSellerDiscount?: number;
    
    barcode?: string;
    
    /** Stok kodu */
    stockCode?: string;

    /** İçerik ID */
    contentId?: string;
    
    /** KDV oranı */
    vatRate?: number;
    
    productSize?: string;
    productColor?: string;
    orderLineItemStatusName?: string;
    
    /** Satıcı ID */
    sellerId?: number;

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
 * İndirim Görüntüleme Bilgisi
 * Siparişte uygulanan indirimlerin detay bilgilerini içerir.
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
// Güncelleme: 2 Şubat 2026 API değişiklikleri uygulandı
// İsimlendirme değişiklikleri:
// - claimId (eski: content/id)
// - vatRate (eski: vatBaseAmount)
// ============================================

/**
 * Trendyol İade/Claim Arayüzü
 * @since 2 Şubat 2026 - API alan isimleri güncellendi
 */
export interface TrendyolClaim {
    /** Claim ID */
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
    
    /** Stok kodu */
    stockCode?: string;

    /** İçerik ID */
    contentId?: string;
    
    quantity?: number;
    
    /** Birim fiyat */
    lineUnitPrice?: number;
    
    /** Brüt tutar */
    lineGrossAmount?: number;
    
    /** KDV oranı */
    vatRate?: number;
    
    /** Claim item durumu */
    claimItemStatus?: string;
    
    /** İade nedeni */
    claimItemReason?: string;
    
    productSize?: string;
    productColor?: string;
    
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

// ============================================
// PRODUCT V2 TYPES (Content-Based Model)
// 10 Şubat 2026 - Barkod bazlı yapıdan content bazlı yapıya geçiş
// Eski v1 servisleri 10 Ağustos 2026'da kapanacak
// @see https://developers.trendyol.com
// ============================================

/**
 * v2 Teslimat Seçeneği
 */
export interface DeliveryOptionV2 {
    /** Teslimat süresi (gün) */
    deliveryDuration: number;
    /** Hızlı teslimat tipi */
    fastDeliveryType?: 'SAME_DAY_SHIPPING' | 'FAST_DELIVERY';
}

/**
 * v2 Ürün Özelliği (Request)
 * attributeValueIds: ID listesi ile değer atama
 * attributeValue: Serbest metin ile özel değer atama (allowCustom=true ise)
 */
export interface ProductAttributeV2Request {
    /** Özellik ID'si (kategori özellik servisinden alınır) */
    attributeId: number;
    /** Özellik değer ID'leri (allowMultipleAttributeValues=true ise birden fazla) */
    attributeValueIds?: number[];
    /** Serbest metin özellik değeri (allowCustom=true ise kullanılır) */
    attributeValue?: string;
}

/**
 * v2 Ürün Oluşturma İsteği - Tek Ürün
 * @see POST /integration/product/sellers/{sellerId}/v2/products
 */
export interface CreateProductV2Item {
    /** Barkod (max 40 karakter, sadece '.', '-', '_' özel karakter) - Zorunlu */
    barcode: string;
    /** Ürün başlığı (max 100 karakter) - Zorunlu */
    title: string;
    /** Ürün açıklaması (max 30.000 karakter, HTML destekli) - Zorunlu */
    description: string;
    /** Ürün ana ID'si (varyant gruplama için, max 40 karakter) - Zorunlu */
    productMainId: string;
    /** Trendyol marka ID'si - Zorunlu */
    brandId: number;
    /** Trendyol kategori ID'si (en alt seviye) - Zorunlu */
    categoryId: number;
    /** Stok adedi - Zorunlu */
    quantity: number;
    /** Stok kodu (satıcı iç kodu, max 100 karakter) - Zorunlu */
    stockCode: string;
    /** Desi ağırlığı - Zorunlu */
    dimensionalWeight: number;
    /** Liste fiyatı (salePrice'dan düşük olamaz) - Zorunlu */
    listPrice: number;
    /** Satış fiyatı - Zorunlu */
    salePrice: number;
    /** KDV oranı (0, 1, 10 veya 20) - Zorunlu */
    vatRate: 0 | 1 | 10 | 20;
    /** Lot/parti numarası (max 100 karakter) */
    lotNumber?: string;
    /** Gönderim adresi ID'si (getSuppliersAddresses servisinden alınır) */
    shipmentAddressId?: number;
    /** İade adresi ID'si (getSuppliersAddresses servisinden alınır) */
    returningAddressId?: number;
    /** Teslimat seçeneği */
    deliveryOption?: DeliveryOptionV2;
    /** Ürün görselleri (max 8 adet, HTTPS, 1200x1800px, 96dpi) - Zorunlu */
    images: ProductImage[];
    /** Ürün özellikleri (kategori özellik servisinden alınır) - Zorunlu */
    attributes: ProductAttributeV2Request[];
}

/**
 * v2 Ürün Oluşturma İsteği
 * @see POST /integration/product/sellers/{sellerId}/v2/products
 */
export interface CreateProductV2Request {
    /** Ürün listesi (max 1.000 adet) */
    items: CreateProductV2Item[];
}

/**
 * v2 Toplu İşlem Yanıtı (batchRequestId döner)
 */
export interface BatchRequestResponse {
    /** Toplu işlem takip ID'si (getBatchRequestResult ile kontrol edilir) */
    batchRequestId: string;
}

// ============================================
// PRODUCT FILTERING V2 TYPES
// ============================================

/**
 * v2 Ürün Temel Bilgi Yanıtı
 * @see GET /integration/product/sellers/{sellerId}/product/{barcode}
 */
export interface ProductBasicInfoV2 {
    /** Barkod */
    barcode: string;
    /** Onay durumu */
    approved: boolean;
    /** Onay tarihi (timestamp ms) */
    approvedDate?: number;
    /** Arşiv durumu */
    archived: boolean;
    /** Listeleme ID'si */
    listingId?: string;
    /** Content ID (v2 content-based model) */
    contentId?: number;
}

/**
 * v2 Onaysız Ürün Filtreleme Parametreleri
 * @see GET /integration/product/sellers/{sellerId}/products/unapproved
 */
export interface UnapprovedProductFiltersV2 {
    /** Barkod filtresi */
    barcode?: string;
    /** Başlangıç tarihi (timestamp ms) */
    startDate?: number;
    /** Bitiş tarihi (timestamp ms) */
    endDate?: number;
    /** Sayfa numarası */
    page?: number;
    /** Tarih filtre tipi */
    dateQueryType?: 'CREATED_DATE' | 'LAST_MODIFIED_DATE';
    /** Sayfa boyutu (max 1000) */
    size?: number;
    /** Satıcı ID */
    supplierId?: number;
    /** Stok kodu filtresi */
    stockCode?: string;
    /** Ürün ana ID filtresi */
    productMainId?: string;
    /** Marka ID'leri filtresi */
    brandIds?: number[];
    /** Durum filtresi */
    status?: 'rejected' | 'pendingApproval';
    /** Sayfalama token'ı (10.000+ kayıt için) */
    nextPageToken?: string;
}

/**
 * v2 Red Nedeni Detayı
 */
export interface RejectReasonDetail {
    /** Red nedeni */
    rejectReason: string;
    /** Red nedeni detayı */
    rejectReasonDetail: string;
}

/**
 * v2 Marka Bilgisi
 */
export interface BrandInfoV2 {
    id: number;
    name: string;
}

/**
 * v2 Kategori Bilgisi
 */
export interface CategoryInfoV2 {
    id: number;
    name: string;
}

/**
 * v2 Onaysız Ürün Modeli
 */
export interface UnapprovedProductV2 {
    /** Satıcı ID */
    supplierId?: number;
    /** Ürün ana ID */
    productMainId?: string;
    /** Oluşturulma tarihi (timestamp ms) */
    createDateTime?: number;
    /** Son güncelleme tarihi (timestamp ms) */
    lastUpdateDate?: number;
    /** Son fiyat değişikliği tarihi */
    lastPriceChangeDate?: number;
    /** Son stok değişikliği tarihi */
    lastStockChangeDate?: number;
    /** Marka bilgisi */
    brand?: BrandInfoV2;
    /** Kategori bilgisi */
    category?: CategoryInfoV2;
    /** Barkod */
    barcode?: string;
    /** Başlık */
    title?: string;
    /** Açıklama */
    description?: string;
    /** Stok adedi */
    quantity?: number;
    /** Liste fiyatı */
    listPrice?: number;
    /** Satış fiyatı */
    salePrice?: number;
    /** KDV oranı */
    vatRate?: number;
    /** Desi ağırlığı */
    dimensionalWeight?: number;
    /** Stok kodu */
    stockCode?: string;
    /** Görseller */
    media?: ProductImage[];
    /** Özellikler */
    attributes?: ProductAttributeV2Request[];
    /** Red nedeni detayları */
    rejectReasonDetails?: RejectReasonDetail[];
    /** Konum bazlı teslimat */
    locationBasedDelivery?: string;
    /** Lot numarası */
    lotNumber?: string;
}

/**
 * v2 Sayfalanmış Yanıt (nextPageToken destekli)
 */
export interface PaginatedResponseV2<T> {
    /** Toplam eleman sayısı */
    totalElements: number;
    /** Toplam sayfa sayısı */
    totalPages: number;
    /** Mevcut sayfa */
    page: number;
    /** Sayfa boyutu */
    size: number;
    /** Sonraki sayfa token'ı (10.000+ kayıt için) */
    nextPageToken?: string;
    /** Sonuç listesi */
    content: T[];
}

/**
 * v2 Onaylı Ürün Filtreleme Parametreleri
 * @see GET /integration/product/sellers/{sellerId}/products/approved
 */
export interface ApprovedProductFiltersV2 {
    /** Barkod filtresi */
    barcode?: string;
    /** Başlangıç tarihi (timestamp ms) */
    startDate?: number;
    /** Bitiş tarihi (timestamp ms) */
    endDate?: number;
    /** Sayfa numarası */
    page?: number;
    /** Tarih filtre tipi */
    dateQueryType?: 'VARIANT_CREATED_DATE' | 'VARIANT_MODIFIED_DATE' | 'CONTENT_MODIFIED_DATE';
    /** Sayfa boyutu (max 100) */
    size?: number;
    /** Satıcı ID */
    supplierId?: number;
    /** Stok kodu filtresi */
    stockCode?: string;
    /** Ürün ana ID filtresi */
    productMainId?: string;
    /** Marka ID'leri filtresi */
    brandIds?: number[];
    /** Durum filtresi */
    status?: 'archived' | 'blacklisted' | 'locked' | 'onSale';
    /** Sayfalama token'ı (10.000+ kayıt için) */
    nextPageToken?: string;
}

/**
 * v2 Hızlı Teslimat Seçeneği
 */
export interface FastDeliveryOption {
    /** Teslimat seçenek tipi */
    deliveryOptionType: string;
    /** Günlük kesim saati */
    deliveryDailyCutOffHour?: string;
}

/**
 * v2 Varyant Teslimat Seçenekleri
 */
export interface VariantDeliveryOptions {
    /** Teslimat süresi (gün) */
    deliveryDuration?: number;
    /** Hızlı teslimat aktif mi */
    isRushDelivery?: boolean;
    /** Hızlı teslimat seçenekleri */
    fastDeliveryOptions?: FastDeliveryOption[];
}

/**
 * v2 Varyant Stok Bilgisi
 */
export interface VariantStock {
    /** Son değişiklik tarihi */
    lastModifiedDate?: number;
}

/**
 * v2 Varyant Fiyat Bilgisi
 */
export interface VariantPrice {
    /** Satış fiyatı */
    salePrice: number;
    /** Liste fiyatı */
    listPrice: number;
}

/**
 * v2 Varyant Özelliği
 */
export interface VariantAttributeV2 {
    /** Özellik ID */
    attributeId: number;
    /** Özellik adı */
    attributeName: string;
    /** Özellik değer ID */
    attributeValueId?: number;
    /** Özellik değeri */
    attributeValue: string;
}

/**
 * v2 Onaylı Ürün Varyantı
 */
export interface ApprovedProductVariantV2 {
    /** Varyant ID */
    variantId?: number;
    /** Satıcı ID */
    supplierId?: number;
    /** Barkod */
    barcode?: string;
    /** Varyant özellikleri */
    attributes?: VariantAttributeV2[];
    /** Ürün URL'si */
    productUrl?: string;
    /** Satışta mı */
    onSale?: boolean;
    /** Teslimat seçenekleri */
    deliveryOptions?: VariantDeliveryOptions;
    /** Stok bilgisi */
    stock?: VariantStock;
    /** Fiyat bilgisi */
    price?: VariantPrice;
    /** Stok kodu */
    stockCode?: string;
    /** KDV oranı */
    vatRate?: number;
    /** Satıcı oluşturma tarihi */
    sellerCreatedDate?: number;
    /** Satıcı güncelleme tarihi */
    sellerModifiedDate?: number;
    /** Kilitli mi */
    locked?: boolean;
    /** Kilit nedeni */
    lockReason?: string;
    /** Kilit tarihi */
    lockDate?: number;
    /** Arşivlenmiş mi */
    archived?: boolean;
    /** Arşiv tarihi */
    archivedDate?: number;
    /** Belge gerekli mi */
    docNeeded?: boolean;
    /** İhlal var mı */
    hasViolation?: boolean;
    /** Kara listede mi */
    blacklisted?: boolean;
}

/**
 * v2 Content Özelliği (Response)
 */
export interface ContentAttributeV2 {
    /** Özellik ID */
    attributeId: number;
    /** Özellik adı */
    attributeName: string;
    /** Özellik değerleri */
    attributeValues: {
        attributeValueId?: number;
        attributeValue: string;
    }[];
}

/**
 * v2 Onaylı Ürün Modeli (Content-Based)
 * Trendyol'un yeni content-bazlı yapısı: bir contentId altında birden fazla varyant
 */
export interface ApprovedProductV2 {
    /** Content ID (v2 content-based yapının temel birimi) */
    contentId: number;
    /** Ürün ana ID */
    productMainId?: string;
    /** Marka bilgisi */
    brand?: BrandInfoV2;
    /** Kategori bilgisi */
    category?: CategoryInfoV2;
    /** Content oluşturulma tarihi */
    creationDate?: number;
    /** Son güncelleme tarihi */
    lastModifiedDate?: number;
    /** Son güncelleyen */
    lastModifiedBy?: string;
    /** Başlık */
    title?: string;
    /** Açıklama */
    description?: string;
    /** Görseller */
    images?: ProductImage[];
    /** Content özellikleri */
    attributes?: ContentAttributeV2[];
    /** Varyantlar */
    variants?: ApprovedProductVariantV2[];
}

// ============================================
// PRODUCT UPDATE V2 TYPES
// ============================================

/**
 * v2 Onaysız Ürün Güncelleme - Tek Ürün
 * @see POST /integration/product/sellers/{sellerId}/products/unapproved-bulk-update
 */
export interface UpdateUnapprovedProductV2Item {
    /** Barkod (zorunlu - güncelleme hedefini belirler) */
    barcode: string;
    /** Ürün başlığı */
    title?: string;
    /** Açıklama */
    description?: string;
    /** Ürün ana ID */
    productMainId?: string;
    /** Marka ID */
    brandId?: number;
    /** Kategori ID */
    categoryId?: number;
    /** Stok kodu */
    stockCode?: string;
    /** Desi ağırlığı */
    dimensionalWeight?: number;
    /** KDV oranı */
    vatRate?: number;
    /** Teslimat seçeneği */
    deliveryOption?: DeliveryOptionV2;
    /** Konum bazlı teslimat */
    locationBasedDelivery?: 'ENABLED' | 'DISABLED' | null;
    /** Lot numarası */
    lotNumber?: string;
    /** Gönderim adresi ID */
    shipmentAddressId?: number;
    /** İade adresi ID */
    returningAddressId?: number;
    /** Görseller */
    images?: ProductImage[];
    /** Özellikler */
    attributes?: ProductAttributeV2Request[];
}

/**
 * v2 Onaysız Ürün Güncelleme İsteği
 */
export interface UpdateUnapprovedProductV2Request {
    /** Ürün listesi (max 1.000 adet) */
    items: UpdateUnapprovedProductV2Item[];
}

/**
 * v2 Onaylı Ürün Content Güncelleme - Tek Ürün
 * @see POST /integration/product/sellers/{sellerId}/products/content-bulk-update
 * NOT: barcode, productMainId, brandId, categoryId ve slicer/varianter özellikler güncellenemez
 */
export interface UpdateApprovedContentV2Item {
    /** Content ID (zorunlu - content-based model'in temel birimi) */
    contentId: number;
    /** Ürün başlığı */
    title?: string;
    /** Açıklama */
    description?: string;
    /** Görseller */
    images?: ProductImage[];
    /** Özellikler (güncelleme yapılırsa TÜM özellik/değer çiftleri gönderilmeli) */
    attributes?: ProductAttributeV2Request[];
}

/**
 * v2 Onaylı Ürün Content Güncelleme İsteği
 */
export interface UpdateApprovedContentV2Request {
    /** Content listesi (max 1.000 adet) */
    items: UpdateApprovedContentV2Item[];
}

/**
 * v2 Onaylı Ürün Varyant Güncelleme - Tek Varyant
 * @see POST /integration/product/sellers/{sellerId}/products/variant-bulk-update
 */
export interface UpdateApprovedVariantV2Item {
    /** Barkod (zorunlu - varyantı belirler) */
    barcode: string;
    /** Stok kodu */
    stockCode?: string;
    /** KDV oranı */
    vatRate?: number;
    /** Desi ağırlığı */
    dimensionalWeight?: number;
    /** Lot numarası */
    lotNumber?: string;
    /** Gönderim adresi ID */
    shipmentAddressId?: number;
    /** İade adresi ID */
    returningAddressId?: number;
    /** Konum bazlı teslimat */
    locationBasedDelivery?: 'ENABLED' | 'DISABLED' | null;
}

/**
 * v2 Onaylı Ürün Varyant Güncelleme İsteği
 */
export interface UpdateApprovedVariantV2Request {
    /** Varyant listesi (max 1.000 adet) */
    items: UpdateApprovedVariantV2Item[];
}

/**
 * v2 Teslimat Bilgisi Güncelleme - Tek Ürün
 * @see POST /integration/product/sellers/{sellerId}/products/delivery-option-update
 */
export interface UpdateDeliveryOptionV2Item {
    /** Barkod (zorunlu) */
    barcode: string;
    /** Teslimat seçeneği */
    deliveryOption: DeliveryOptionV2;
}

/**
 * v2 Teslimat Bilgisi Güncelleme İsteği
 */
export interface UpdateDeliveryOptionV2Request {
    /** Ürün listesi (max 1.000 adet) */
    items: UpdateDeliveryOptionV2Item[];
}

// ============================================
// CATEGORY V2 TYPES
// ============================================

/**
 * v2 Kategori Özelliği
 * @see GET /integration/product/categories/{categoryId}/attributes
 */
export interface CategoryAttributeV2 {
    /** Özel değer girişi izni */
    allowCustom: boolean;
    /** Özellik bilgisi */
    attribute: {
        id: number;
        name: string;
    };
    /** Kategori ID */
    categoryId: number;
    /** Zorunlu mu */
    required: boolean;
    /** Varyant özelliği mi (ürün sayfasında varyant oluşturur) */
    varianter: boolean;
    /** Dilimleyici mi (ayrı ürün kartları oluşturur) */
    slicer: boolean;
    /** Çoklu değer atanabilir mi */
    allowMultipleAttributeValues: boolean;
}

/**
 * v2 Kategori Özellik Listesi Yanıtı
 */
export interface CategoryAttributeListV2Response {
    /** Kategori ID */
    id: number;
    /** Kategori adı (sistem) */
    name: string;
    /** Kategori görüntüleme adı (frontend) */
    displayName: string;
    /** Kategori özellikleri */
    categoryAttributes: CategoryAttributeV2[];
}

/**
 * v2 Kategori Özellik Değeri
 * @see GET /integration/product/categories/{categoryId}/attributes/{attributeId}/values
 */
export interface CategoryAttributeValueV2 {
    /** Özellik değer ID */
    attributeValueId: number;
    /** Özellik değer adı */
    attributeValueName: string;
}

/**
 * v2 Kategori Özellik Değerleri Filtreleri
 */
export interface CategoryAttributeValuesFiltersV2 {
    /** Sayfa boyutu (max 1000) */
    size?: number;
    /** Sayfa numarası (max 1000) */
    page?: number;
    /** Özellik değer ID filtresi */
    attributeValueId?: number;
    /** Özellik değer adı filtresi */
    attributeValueName?: string;
}
