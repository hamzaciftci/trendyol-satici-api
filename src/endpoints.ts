/**
 * Trendyol API Endpoints
 * 
 * @author Hamza ÇİFTÇİ <hamzaciftci80@gmail.com>
 * @license MIT
 * @see https://github.com/hamzaciftci/trendyol-api-client
 */

// ============================================
// BASE URLS
// ============================================

export const BASE_URLS = {
    PRODUCTION: 'https://apigw.trendyol.com',
    SANDBOX: 'https://stageapigw.trendyol.com',
} as const;

// ============================================
// PRODUCT ENDPOINTS
// ============================================

export const PRODUCT_ENDPOINTS = {
    BRANDS: '/integration/product/brands',
    BRANDS_BY_NAME: '/integration/product/brands/by-name',
    CATEGORIES: '/integration/product/product-categories',
    CATEGORY_ATTRIBUTES: '/integration/product/product-categories/{categoryId}/attributes',
    PRODUCTS: '/integration/product/sellers/{supplierId}/products',
    PRODUCT_BY_ID: '/integration/product/sellers/{supplierId}/products/{productId}',
    BATCH_REQUESTS: '/integration/product/sellers/{supplierId}/products/batch-requests/{batchRequestId}',
} as const;

// ============================================
// ORDER ENDPOINTS
// ============================================

export const ORDER_ENDPOINTS = {
    ORDERS: '/integration/order/sellers/{supplierId}/orders',
    ORDER_BY_ID: '/integration/order/sellers/{supplierId}/orders/{orderId}',
    SHIPMENT_PACKAGES: '/integration/order/sellers/{supplierId}/shipment-packages',
    UPDATE_TRACKING: '/integration/order/sellers/{supplierId}/shipment-packages/{shipmentPackageId}/update-tracking',
    UPDATE_STATUS: '/integration/order/sellers/{supplierId}/shipment-packages',
} as const;

// ============================================
// QUESTION ENDPOINTS
// ============================================

export const QUESTION_ENDPOINTS = {
    QUESTIONS: '/integration/qna/sellers/{supplierId}/questions/filter',
    ANSWER_QUESTION: '/integration/qna/sellers/{supplierId}/questions/{questionId}/answers',
} as const;

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

export const WEBHOOK_ENDPOINTS = {
    WEBHOOKS: '/integration/webhook/sellers/{supplierId}/webhooks',
    WEBHOOK_BY_ID: '/integration/webhook/sellers/{supplierId}/webhooks/{webhookId}',
} as const;

// ============================================
// CLAIMS (İADE) ENDPOINTS
// Güncelleme: 2 Şubat 2026 API değişiklikleri
// ============================================

export const CLAIMS_ENDPOINTS = {
    CLAIMS: '/integration/order/sellers/{supplierId}/claims',
    CLAIM_BY_ID: '/integration/order/sellers/{supplierId}/claims/{claimId}',
    CLAIM_ISSUE_REASONS: '/integration/order/sellers/{supplierId}/claims/issue-reasons',
} as const;

// ============================================
// FINANCE ENDPOINTS (Cari Hesap Ekstresi)
// Güncelleme: 29 Ocak 2026 - transactionTypes ve paymentDate parametreleri eklendi
// ============================================

export const FINANCE_ENDPOINTS = {
    SETTLEMENTS: '/integration/finance/che/sellers/{sellerId}/settlements',
    OTHER_FINANCIALS: '/integration/finance/che/sellers/{sellerId}/otherfinancials',
} as const;

// ============================================
// PRODUCT V2 ENDPOINTS (Content-Based Model)
// 10 Şubat 2026 - Barkod bazlı yapıdan content bazlı yapıya geçiş
// Eski v1 servisleri 10 Ağustos 2026'da kapanacak
// ============================================

export const PRODUCT_V2_ENDPOINTS = {
    /** Ürün Yaratma v2 */
    CREATE: '/integration/product/sellers/{sellerId}/v2/products',
    /** Ürün Filtreleme - Temel Bilgiler v2 */
    FILTER_BASIC_INFO: '/integration/product/sellers/{sellerId}/product/{barcode}',
    /** Ürün Filtreleme - Onaysız Ürün v2 */
    FILTER_UNAPPROVED: '/integration/product/sellers/{sellerId}/products/unapproved',
    /** Ürün Filtreleme - Onaylı Ürün v2 */
    FILTER_APPROVED: '/integration/product/sellers/{sellerId}/products/approved',
    /** Ürün Güncelleme - Onaysız Ürün v2 */
    UPDATE_UNAPPROVED: '/integration/product/sellers/{sellerId}/products/unapproved-bulk-update',
    /** Ürün Güncelleme - Onaylı Ürün Content Güncelleme v2 */
    UPDATE_APPROVED_CONTENT: '/integration/product/sellers/{sellerId}/products/content-bulk-update',
    /** Ürün Güncelleme - Onaylı Ürün Varyant Güncelleme v2 */
    UPDATE_APPROVED_VARIANT: '/integration/product/sellers/{sellerId}/products/variant-bulk-update',
    /** Ürün Güncelleme - Teslimat Bilgisi Güncelleme v2 */
    UPDATE_DELIVERY_OPTION: '/integration/product/sellers/{sellerId}/products/delivery-option-update',
} as const;

// ============================================
// CATEGORY V2 ENDPOINTS
// ============================================

export const CATEGORY_V2_ENDPOINTS = {
    /** Kategori Özellik Listesi v2 */
    ATTRIBUTES: '/integration/product/categories/{categoryId}/attributes',
    /** Kategori Özellik Değerleri Listesi v2 */
    ATTRIBUTE_VALUES: '/integration/product/categories/{categoryId}/attributes/{attributeId}/values',
} as const;

// ============================================
// SELLER ENDPOINTS
// ============================================

export const SELLER_ENDPOINTS = {
    COMMON_LABEL: '/integration/sellers/{supplierId}/common-label/{cargoTrackingNumber}',
    ADDRESSES: '/integration/sellers/{supplierId}/addresses',
} as const;

// ============================================
// ENDPOINT BUILDERS
// ============================================

export function buildEndpoint(endpoint: string, params: Record<string, string | number>): string {
    let result = endpoint;
    for (const [key, value] of Object.entries(params)) {
        result = result.replace(`{${key}}`, String(value));
    }
    return result;
}

export function buildProductsEndpoint(supplierId: string): string {
    return buildEndpoint(PRODUCT_ENDPOINTS.PRODUCTS, { supplierId });
}

export function buildOrdersEndpoint(supplierId: string): string {
    return buildEndpoint(ORDER_ENDPOINTS.ORDERS, { supplierId });
}

export function buildQuestionsEndpoint(supplierId: string): string {
    return buildEndpoint(QUESTION_ENDPOINTS.QUESTIONS, { supplierId });
}

export function buildQuestionAnswerEndpoint(supplierId: string, questionId: string): string {
    return buildEndpoint(QUESTION_ENDPOINTS.ANSWER_QUESTION, { supplierId, questionId });
}

export function buildWebhooksEndpoint(supplierId: string): string {
    return buildEndpoint(WEBHOOK_ENDPOINTS.WEBHOOKS, { supplierId });
}

export function buildCategoryAttributesEndpoint(categoryId: number): string {
    return buildEndpoint(PRODUCT_ENDPOINTS.CATEGORY_ATTRIBUTES, { categoryId });
}

export function buildClaimsEndpoint(supplierId: string): string {
    return buildEndpoint(CLAIMS_ENDPOINTS.CLAIMS, { supplierId });
}

export function buildClaimIssueReasonsEndpoint(supplierId: string): string {
    return buildEndpoint(CLAIMS_ENDPOINTS.CLAIM_ISSUE_REASONS, { supplierId });
}

export function buildSettlementsEndpoint(sellerId: string): string {
    return buildEndpoint(FINANCE_ENDPOINTS.SETTLEMENTS, { sellerId });
}

export function buildOtherFinancialsEndpoint(sellerId: string): string {
    return buildEndpoint(FINANCE_ENDPOINTS.OTHER_FINANCIALS, { sellerId });
}

// ============================================
// V2 ENDPOINT BUILDERS
// ============================================

export function buildCreateProductV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.CREATE, { sellerId });
}

export function buildProductBasicInfoV2Endpoint(sellerId: string, barcode: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.FILTER_BASIC_INFO, { sellerId, barcode });
}

export function buildUnapprovedProductsV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.FILTER_UNAPPROVED, { sellerId });
}

export function buildApprovedProductsV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.FILTER_APPROVED, { sellerId });
}

export function buildUpdateUnapprovedProductV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.UPDATE_UNAPPROVED, { sellerId });
}

export function buildUpdateApprovedContentV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.UPDATE_APPROVED_CONTENT, { sellerId });
}

export function buildUpdateApprovedVariantV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.UPDATE_APPROVED_VARIANT, { sellerId });
}

export function buildUpdateDeliveryOptionV2Endpoint(sellerId: string): string {
    return buildEndpoint(PRODUCT_V2_ENDPOINTS.UPDATE_DELIVERY_OPTION, { sellerId });
}

export function buildCategoryAttributesV2Endpoint(categoryId: number): string {
    return buildEndpoint(CATEGORY_V2_ENDPOINTS.ATTRIBUTES, { categoryId });
}

export function buildCategoryAttributeValuesV2Endpoint(categoryId: number, attributeId: number): string {
    return buildEndpoint(CATEGORY_V2_ENDPOINTS.ATTRIBUTE_VALUES, { categoryId, attributeId });
}
