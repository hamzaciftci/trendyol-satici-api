/**
 * Trendyol Satıcı API Client
 * 
 * @author Hamza ÇİFTÇİ <hamzaciftci80@gmail.com>
 * @license MIT
 * @see https://github.com/hamzaciftci/trendyol-satici-api
 */

import * as https from 'https';
import * as http from 'http';
import {
    TrendyolConfig,
    ApiResponse,
    TrendyolProduct,
    ProductFilters,
    TrendyolOrder,
    OrderFilters,
    TrendyolBrand,
    BrandFilters,
    TrendyolCategory,
    TrendyolQuestion,
    QuestionFilters,
    QuestionAnswer,
    TrendyolWebhook,
    CategoryAttribute,
    TrendyolClaim,
    ClaimFilters,
    ClaimIssueReason,
    SettlementsFilters,
    OtherFinancialsFilters,
    SettlementRecord,
    OtherFinancialsRecord,
    // V2 Types
    CreateProductV2Request,
    BatchRequestResponse,
    ProductBasicInfoV2,
    UnapprovedProductFiltersV2,
    UnapprovedProductV2,
    PaginatedResponseV2,
    ApprovedProductFiltersV2,
    ApprovedProductV2,
    UpdateUnapprovedProductV2Request,
    UpdateApprovedContentV2Request,
    UpdateApprovedVariantV2Request,
    UpdateDeliveryOptionV2Request,
    CategoryAttributeListV2Response,
    CategoryAttributeValueV2,
    CategoryAttributeValuesFiltersV2,
} from './types';
import {
    BASE_URLS,
    PRODUCT_ENDPOINTS,
    buildProductsEndpoint,
    buildOrdersEndpoint,
    buildQuestionsEndpoint,
    buildQuestionAnswerEndpoint,
    buildWebhooksEndpoint,
    buildCategoryAttributesEndpoint,
    buildClaimsEndpoint,
    buildClaimIssueReasonsEndpoint,
    buildSettlementsEndpoint,
    buildOtherFinancialsEndpoint,
    // V2 Endpoint Builders
    buildCreateProductV2Endpoint,
    buildProductBasicInfoV2Endpoint,
    buildUnapprovedProductsV2Endpoint,
    buildApprovedProductsV2Endpoint,
    buildUpdateUnapprovedProductV2Endpoint,
    buildUpdateApprovedContentV2Endpoint,
    buildUpdateApprovedVariantV2Endpoint,
    buildUpdateDeliveryOptionV2Endpoint,
    buildCategoryAttributesV2Endpoint,
    buildCategoryAttributeValuesV2Endpoint,
} from './endpoints';
import {
    buildQueryString,
    buildPaginationParams,
    extractContent,
    dateToTimestamp,
    validateRequired,
} from './utils';

/**
 * Trendyol Marketplace API Client
 * 
 * @example
 * ```typescript
 * const client = new TrendyolClient({
 *     supplierId: 'TEDARIKCI_ID',
 *     apiKey: 'API_ANAHTARI',
 *     apiSecret: 'API_GIZLI_ANAHTARI'
 * });
 * 
 * const urunler = await client.getProducts({ size: 10 });
 * ```
 */
/** Paket versiyonu */
const PACKAGE_VERSION = '2.0.0';

/** Default timeout (ms) */
const DEFAULT_TIMEOUT = 30000;

export class TrendyolClient {
    private config: Required<TrendyolConfig>;
    private baseUrl: string;
    private authHeader: string;
    private timeout: number;

    constructor(config: TrendyolConfig, timeout: number = DEFAULT_TIMEOUT) {
        this.config = {
            ...config,
            environment: config.environment || 'production',
        };

        this.baseUrl = this.config.environment === 'sandbox'
            ? BASE_URLS.SANDBOX
            : BASE_URLS.PRODUCTION;

        const credentials = Buffer.from(
            `${this.config.apiKey}:${this.config.apiSecret}`
        ).toString('base64');
        this.authHeader = `Basic ${credentials}`;
        this.timeout = timeout;
    }

    // ============================================
    // PRIVATE HTTP METHODS
    // ============================================

    private async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        endpoint: string,
        body?: any
    ): Promise<ApiResponse<T>> {
        return new Promise((resolve) => {
            const url = new URL(this.baseUrl + endpoint);
            const isHttps = url.protocol === 'https:';
            const httpModule = isHttps ? https : http;

            const options: https.RequestOptions = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method,
                timeout: this.timeout,
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': `TrendyolSaticiAPI/${PACKAGE_VERSION}`,
                },
            };

            const req = httpModule.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = data ? JSON.parse(data) : null;
                        
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                            resolve({
                                success: true,
                                statusCode: res.statusCode,
                                data: parsedData,
                            });
                        } else {
                            resolve({
                                success: false,
                                statusCode: res.statusCode || 500,
                                error: parsedData?.message || parsedData?.error || `HTTP ${res.statusCode}`,
                                data: parsedData,
                            });
                        }
                    } catch (parseError) {
                        resolve({
                            success: false,
                            statusCode: res.statusCode || 500,
                            error: `Parse error: ${data}`,
                        });
                    }
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    statusCode: 0,
                    error: error.message,
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    statusCode: 0,
                    error: `Request timeout after ${this.timeout}ms`,
                });
            });

            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
    }

    private async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>('GET', endpoint);
    }

    private async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>('POST', endpoint, body);
    }

    private async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>('PUT', endpoint, body);
    }

    private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>('DELETE', endpoint);
    }

    // ============================================
    // BAĞLANTI TESTİ
    // ============================================

    /**
     * API bağlantısını test et
     */
    async testConnection(): Promise<boolean> {
        const response = await this.get(PRODUCT_ENDPOINTS.BRANDS + '?size=1');
        return response.success;
    }

    // ============================================
    // ÜRÜN İŞLEMLERİ (v1 - Legacy)
    // ⚠️ v1 servisleri 10 Ağustos 2026'da kapanacak
    // Yeni entegrasyonlar için v2 metodlarını kullanın
    // ============================================

    /**
     * Ürünleri listele (v1)
     * @deprecated v1 servisi 10 Ağustos 2026'da kapanacak. Yerine {@link getApprovedProductsV2} veya {@link getUnapprovedProductsV2} kullanın.
     */
    async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<TrendyolProduct[]>> {
        const pagination = buildPaginationParams(filters.page, filters.size);
        const params: Record<string, any> = { ...pagination };

        if (filters.approved !== undefined) params.approved = filters.approved;
        if (filters.archived !== undefined) params.archived = filters.archived;
        if (filters.onSale !== undefined) params.onSale = filters.onSale;
        if (filters.rejected !== undefined) params.rejected = filters.rejected;
        if (filters.blacklisted !== undefined) params.blacklisted = filters.blacklisted;
        if (filters.barcode) params.barcode = filters.barcode;
        if (filters.stockCode) params.stockCode = filters.stockCode;
        if (filters.brandIds) params.brandIds = filters.brandIds;
        if (filters.productMainId) params.productMainId = filters.productMainId;
        
        if (filters.startDate) {
            params.startDate = typeof filters.startDate === 'string' 
                ? dateToTimestamp(filters.startDate) 
                : filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = typeof filters.endDate === 'string' 
                ? dateToTimestamp(filters.endDate) 
                : filters.endDate;
        }
        if (filters.dateQueryType) params.dateQueryType = filters.dateQueryType;

        const endpoint = buildProductsEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolProduct>(response.data),
            };
        }

        return response as ApiResponse<TrendyolProduct[]>;
    }

    /**
     * Barkodla ürün ara (v1)
     * @deprecated v1 servisi 10 Ağustos 2026'da kapanacak. Yerine {@link getProductBasicInfoV2} kullanın.
     */
    async getProductByBarcode(barcode: string): Promise<ApiResponse<TrendyolProduct | null>> {
        const response = await this.getProducts({ barcode, size: 1 });
        
        if (response.success && response.data && response.data.length > 0) {
            return {
                success: true,
                statusCode: response.statusCode,
                data: response.data[0],
            };
        }

        return {
            success: response.success,
            statusCode: response.statusCode,
            data: null,
            error: response.error,
        };
    }

    // ============================================
    // SİPARİŞ İŞLEMLERİ
    // ============================================

    /**
     * Siparişleri listele
     */
    async getOrders(filters: OrderFilters = {}): Promise<ApiResponse<TrendyolOrder[]>> {
        const pagination = buildPaginationParams(filters.page, filters.size);
        const params: Record<string, any> = { ...pagination };

        if (filters.status) params.status = filters.status;
        if (filters.orderNumber) params.orderNumber = filters.orderNumber;
        if (filters.orderByField) params.orderByField = filters.orderByField;
        if (filters.orderByDirection) params.orderByDirection = filters.orderByDirection;
        
        if (filters.startDate) {
            params.startDate = typeof filters.startDate === 'string' 
                ? dateToTimestamp(filters.startDate) 
                : filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = typeof filters.endDate === 'string' 
                ? dateToTimestamp(filters.endDate) 
                : filters.endDate;
        }

        const endpoint = buildOrdersEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolOrder>(response.data),
            };
        }

        return response as ApiResponse<TrendyolOrder[]>;
    }

    /**
     * Son X günün siparişlerini getir
     */
    async getRecentOrders(days: number = 7, size: number = 50): Promise<ApiResponse<TrendyolOrder[]>> {
        const endDate = Date.now();
        const startDate = endDate - (days * 24 * 60 * 60 * 1000);
        
        return this.getOrders({
            startDate,
            endDate,
            size,
        });
    }

    // ============================================
    // MARKA İŞLEMLERİ
    // ============================================

    /**
     * Markaları listele
     */
    async getBrands(filters: BrandFilters = {}): Promise<ApiResponse<TrendyolBrand[]>> {
        const pagination = buildPaginationParams(filters.page, filters.size);
        const endpoint = PRODUCT_ENDPOINTS.BRANDS + buildQueryString(pagination);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolBrand>(response.data),
            };
        }

        return response as ApiResponse<TrendyolBrand[]>;
    }

    /**
     * İsimle marka ara
     */
    async getBrandByName(name: string): Promise<ApiResponse<TrendyolBrand[]>> {
        validateRequired(name, 'name');
        const endpoint = PRODUCT_ENDPOINTS.BRANDS_BY_NAME + buildQueryString({ name });
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolBrand>(response.data),
            };
        }

        return response as ApiResponse<TrendyolBrand[]>;
    }

    // ============================================
    // KATEGORİ İŞLEMLERİ
    // ============================================

    /**
     * Kategorileri listele
     */
    async getCategories(): Promise<ApiResponse<TrendyolCategory[]>> {
        const response = await this.get<any>(PRODUCT_ENDPOINTS.CATEGORIES);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolCategory>(response.data),
            };
        }

        return response as ApiResponse<TrendyolCategory[]>;
    }

    /**
     * Kategori özelliklerini getir (v1)
     * @deprecated v1 servisi 10 Ağustos 2026'da kapanacak. Yerine {@link getCategoryAttributesV2} kullanın.
     */
    async getCategoryAttributes(categoryId: number): Promise<ApiResponse<CategoryAttribute[]>> {
        validateRequired(categoryId, 'categoryId');
        const endpoint = buildCategoryAttributesEndpoint(categoryId);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            const attributes = response.data.categoryAttributes || response.data;
            return {
                ...response,
                data: Array.isArray(attributes) ? attributes : [],
            };
        }

        return response as ApiResponse<CategoryAttribute[]>;
    }

    // ============================================
    // MÜŞTERİ SORULARI
    // ============================================

    /**
     * Müşteri sorularını listele
     */
    async getQuestions(filters: QuestionFilters = {}): Promise<ApiResponse<TrendyolQuestion[]>> {
        const pagination = buildPaginationParams(filters.page, filters.size);
        const params: Record<string, any> = { ...pagination };

        if (filters.status) params.status = filters.status;
        if (filters.barcode) params.barcode = filters.barcode;
        if (filters.orderByField) params.orderByField = filters.orderByField;
        if (filters.orderByDirection) params.orderByDirection = filters.orderByDirection;
        
        if (filters.startDate) {
            params.startDate = typeof filters.startDate === 'string' 
                ? dateToTimestamp(filters.startDate) 
                : filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = typeof filters.endDate === 'string' 
                ? dateToTimestamp(filters.endDate) 
                : filters.endDate;
        }

        const endpoint = buildQuestionsEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolQuestion>(response.data),
            };
        }

        return response as ApiResponse<TrendyolQuestion[]>;
    }

    /**
     * Cevaplanmamış soruları getir
     */
    async getUnansweredQuestions(size: number = 50): Promise<ApiResponse<TrendyolQuestion[]>> {
        return this.getQuestions({
            status: 'WAITING_FOR_ANSWER',
            size,
        });
    }

    /**
     * Müşteri sorusunu cevapla
     */
    async answerQuestion(answer: QuestionAnswer): Promise<ApiResponse<any>> {
        validateRequired(answer.questionId, 'questionId');
        validateRequired(answer.text, 'text');

        const endpoint = buildQuestionAnswerEndpoint(this.config.supplierId, answer.questionId);
        return this.post(endpoint, { text: answer.text });
    }

    // ============================================
    // WEBHOOK İŞLEMLERİ
    // ============================================

    /**
     * Webhook'ları listele
     */
    async getWebhooks(): Promise<ApiResponse<TrendyolWebhook[]>> {
        const endpoint = buildWebhooksEndpoint(this.config.supplierId);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            const webhooks = response.data.webhooks || response.data;
            return {
                ...response,
                data: Array.isArray(webhooks) ? webhooks : [],
            };
        }

        return response as ApiResponse<TrendyolWebhook[]>;
    }

    /**
     * Yeni webhook oluştur
     */
    async createWebhook(webhook: Omit<TrendyolWebhook, 'id'>): Promise<ApiResponse<TrendyolWebhook>> {
        validateRequired(webhook.url, 'url');
        const endpoint = buildWebhooksEndpoint(this.config.supplierId);
        return this.post(endpoint, webhook);
    }

    /**
     * Webhook sil
     */
    async deleteWebhook(webhookId: string): Promise<ApiResponse<any>> {
        validateRequired(webhookId, 'webhookId');
        const endpoint = buildWebhooksEndpoint(this.config.supplierId) + `/${webhookId}`;
        return this.delete(endpoint);
    }

    // ============================================
    // İADE (CLAIMS) İŞLEMLERİ
    // Güncelleme: 2 Şubat 2026 API değişiklikleri
    // ============================================

    /**
     * İade taleplerini (claims) listele
     */
    async getClaims(filters: ClaimFilters = {}): Promise<ApiResponse<TrendyolClaim[]>> {
        const pagination = buildPaginationParams(filters.page, filters.size);
        const params: Record<string, any> = { ...pagination };

        if (filters.claimStatus) params.claimStatus = filters.claimStatus;
        if (filters.orderNumber) params.orderNumber = filters.orderNumber;
        if (filters.claimIds) params.claimIds = filters.claimIds;
        if (filters.orderByField) params.orderByField = filters.orderByField;
        if (filters.orderByDirection) params.orderByDirection = filters.orderByDirection;
        
        if (filters.startDate) {
            params.startDate = typeof filters.startDate === 'string' 
                ? dateToTimestamp(filters.startDate) 
                : filters.startDate;
        }
        if (filters.endDate) {
            params.endDate = typeof filters.endDate === 'string' 
                ? dateToTimestamp(filters.endDate) 
                : filters.endDate;
        }

        const endpoint = buildClaimsEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<TrendyolClaim>(response.data),
            };
        }

        return response as ApiResponse<TrendyolClaim[]>;
    }

    /**
     * Son X günün iade taleplerini getir
     */
    async getRecentClaims(days: number = 7, size: number = 50): Promise<ApiResponse<TrendyolClaim[]>> {
        const endDate = Date.now();
        const startDate = endDate - (days * 24 * 60 * 60 * 1000);
        
        return this.getClaims({
            startDate,
            endDate,
            size,
        });
    }

    /**
     * İade nedenlerini getir
     */
    async getClaimIssueReasons(): Promise<ApiResponse<ClaimIssueReason[]>> {
        const endpoint = buildClaimIssueReasonsEndpoint(this.config.supplierId);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            const reasons = response.data.issueReasons || response.data;
            return {
                ...response,
                data: Array.isArray(reasons) ? reasons : [],
            };
        }

        return response as ApiResponse<ClaimIssueReason[]>;
    }

    // ============================================
    // FİNANS İŞLEMLERİ (Cari Hesap Ekstresi)
    // Güncelleme: 29 Ocak 2026 - transactionTypes ve paymentDate parametreleri eklendi
    // @see https://developers.trendyol.com/docs/cari-hesap-ekstresi-entegrasyonu
    // ============================================

    /**
     * Settlements (Satış/İade/İndirim) kayıtlarını listele
     *
     * @example
     * ```typescript
     * // Tek işlem türü ile sorgulama
     * const satislar = await client.getSettlements({
     *     transactionType: 'Sale',
     *     startDate: 1706745600000,
     *     endDate: 1707004800000
     * });
     *
     * // Birden fazla işlem türü ile sorgulama (YENİ - 29 Ocak 2026)
     * const kayitlar = await client.getSettlements({
     *     transactionTypes: ['Sale', 'Return', 'Discount'],
     *     startDate: 1706745600000,
     *     endDate: 1707004800000,
     *     paymentDate: 1707091200000
     * });
     * ```
     */
    async getSettlements(filters: SettlementsFilters): Promise<ApiResponse<SettlementRecord[]>> {
        const params: Record<string, any> = {
            startDate: filters.startDate,
            endDate: filters.endDate,
        };

        // transactionTypes (çoklu) veya transactionType (tekli)
        if (filters.transactionTypes && filters.transactionTypes.length > 0) {
            params.transactionTypes = filters.transactionTypes.join(',');
        } else if (filters.transactionType) {
            params.transactionType = filters.transactionType;
        }

        // paymentDate (YENİ - 29 Ocak 2026)
        if (filters.paymentDate) {
            params.paymentDate = filters.paymentDate;
        }

        if (filters.page !== undefined) params.page = filters.page;
        if (filters.size !== undefined) params.size = filters.size;

        const endpoint = buildSettlementsEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<SettlementRecord>(response.data),
            };
        }

        return response as ApiResponse<SettlementRecord[]>;
    }

    /**
     * OtherFinancials (Havale/Fatura/Kesinti vb.) kayıtlarını listele
     *
     * @example
     * ```typescript
     * // Birden fazla işlem türü ile sorgulama (YENİ - 29 Ocak 2026)
     * const finansallar = await client.getOtherFinancials({
     *     transactionTypes: ['WireTransfer', 'PaymentOrder'],
     *     startDate: 1706745600000,
     *     endDate: 1707004800000,
     *     paymentDate: 1707091200000
     * });
     * ```
     */
    async getOtherFinancials(filters: OtherFinancialsFilters): Promise<ApiResponse<OtherFinancialsRecord[]>> {
        const params: Record<string, any> = {
            startDate: filters.startDate,
            endDate: filters.endDate,
        };

        // transactionTypes (çoklu) veya transactionType (tekli)
        if (filters.transactionTypes && filters.transactionTypes.length > 0) {
            params.transactionTypes = filters.transactionTypes.join(',');
        } else if (filters.transactionType) {
            params.transactionType = filters.transactionType;
        }

        // paymentDate (YENİ - 29 Ocak 2026)
        if (filters.paymentDate) {
            params.paymentDate = filters.paymentDate;
        }

        if (filters.page !== undefined) params.page = filters.page;
        if (filters.size !== undefined) params.size = filters.size;

        const endpoint = buildOtherFinancialsEndpoint(this.config.supplierId) + buildQueryString(params);
        const response = await this.get<any>(endpoint);

        if (response.success && response.data) {
            return {
                ...response,
                data: extractContent<OtherFinancialsRecord>(response.data),
            };
        }

        return response as ApiResponse<OtherFinancialsRecord[]>;
    }

    // ============================================
    // ÜRÜN İŞLEMLERİ v2 (Content-Based Model)
    // 10 Şubat 2026 - Trendyol yeni nesil servisler
    // ============================================

    /**
     * v2 Ürün Oluştur (Content-Based)
     *
     * Trendyol'un yeni content bazlı yapısında ürün oluşturur.
     * Varyantlar aynı productMainId ile gruplandırılır.
     * Yanıtta dönen batchRequestId ile işlem durumu takip edilir.
     *
     * @param data Ürün oluşturma isteği (max 1.000 ürün)
     * @returns batchRequestId içeren yanıt
     *
     * @example
     * ```typescript
     * const result = await client.createProductV2({
     *     items: [{
     *         barcode: '1234567890',
     *         title: 'Örnek Ürün',
     *         description: '<p>Açıklama</p>',
     *         productMainId: 'MAIN-001',
     *         brandId: 1791,
     *         categoryId: 411,
     *         quantity: 100,
     *         stockCode: 'STK-001',
     *         dimensionalWeight: 2,
     *         listPrice: 199.99,
     *         salePrice: 149.99,
     *         vatRate: 10,
     *         images: [{ url: 'https://example.com/img.jpg' }],
     *         attributes: [{ attributeId: 338, attributeValueIds: [6980] }]
     *     }]
     * });
     * ```
     */
    async createProductV2(data: CreateProductV2Request): Promise<ApiResponse<BatchRequestResponse>> {
        validateRequired(data.items, 'items');
        const endpoint = buildCreateProductV2Endpoint(this.config.supplierId);
        return this.post<BatchRequestResponse>(endpoint, data);
    }

    /**
     * v2 Ürün Temel Bilgilerini Getir (Barkod ile)
     *
     * Belirtilen barkod için onay durumu, contentId ve listingId bilgilerini döner.
     *
     * @param barcode Ürün barkodu
     * @returns Ürün temel bilgileri
     *
     * @example
     * ```typescript
     * const info = await client.getProductBasicInfoV2('1234567890');
     * if (info.data?.approved) {
     *     console.log('Content ID:', info.data.contentId);
     * }
     * ```
     */
    async getProductBasicInfoV2(barcode: string): Promise<ApiResponse<ProductBasicInfoV2>> {
        validateRequired(barcode, 'barcode');
        const endpoint = buildProductBasicInfoV2Endpoint(this.config.supplierId, barcode);
        return this.get<ProductBasicInfoV2>(endpoint);
    }

    /**
     * v2 Onaysız Ürünleri Listele
     *
     * Henüz onay almamış veya reddedilmiş ürünleri filtreler.
     * 10.000+ kayıt için nextPageToken ile sayfalama destekler.
     *
     * @param filters Filtreleme parametreleri
     * @returns Sayfalanmış onaysız ürün listesi
     *
     * @example
     * ```typescript
     * const rejected = await client.getUnapprovedProductsV2({
     *     status: 'rejected',
     *     size: 50
     * });
     * rejected.data?.content.forEach(p => {
     *     console.log(p.barcode, p.rejectReasonDetails);
     * });
     * ```
     */
    async getUnapprovedProductsV2(
        filters: UnapprovedProductFiltersV2 = {}
    ): Promise<ApiResponse<PaginatedResponseV2<UnapprovedProductV2>>> {
        const params: Record<string, any> = {};

        if (filters.barcode) params.barcode = filters.barcode;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.page !== undefined) params.page = filters.page;
        if (filters.dateQueryType) params.dateQueryType = filters.dateQueryType;
        if (filters.size !== undefined) params.size = Math.min(filters.size, 1000);
        if (filters.supplierId) params.supplierId = filters.supplierId;
        if (filters.stockCode) params.stockCode = filters.stockCode;
        if (filters.productMainId) params.productMainId = filters.productMainId;
        if (filters.brandIds) params.brandIds = filters.brandIds.join(',');
        if (filters.status) params.status = filters.status;
        if (filters.nextPageToken) params.nextPageToken = filters.nextPageToken;

        const endpoint = buildUnapprovedProductsV2Endpoint(this.config.supplierId) + buildQueryString(params);
        return this.get<PaginatedResponseV2<UnapprovedProductV2>>(endpoint);
    }

    /**
     * v2 Onaylı Ürünleri Listele (Content-Based)
     *
     * Onaylanmış ürünleri content bazlı yapıda getirir.
     * Her content altında varyantlar yer alır.
     * 10.000+ kayıt için nextPageToken ile sayfalama destekler.
     *
     * @param filters Filtreleme parametreleri
     * @returns Sayfalanmış onaylı ürün listesi (content-based)
     *
     * @example
     * ```typescript
     * const products = await client.getApprovedProductsV2({
     *     status: 'onSale',
     *     size: 50
     * });
     * products.data?.content.forEach(content => {
     *     console.log('Content ID:', content.contentId, 'Title:', content.title);
     *     content.variants?.forEach(v => {
     *         console.log('  Varyant:', v.barcode, 'Fiyat:', v.price?.salePrice);
     *     });
     * });
     * ```
     */
    async getApprovedProductsV2(
        filters: ApprovedProductFiltersV2 = {}
    ): Promise<ApiResponse<PaginatedResponseV2<ApprovedProductV2>>> {
        const params: Record<string, any> = {};

        if (filters.barcode) params.barcode = filters.barcode;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.page !== undefined) params.page = filters.page;
        if (filters.dateQueryType) params.dateQueryType = filters.dateQueryType;
        if (filters.size !== undefined) params.size = Math.min(filters.size, 100);
        if (filters.supplierId) params.supplierId = filters.supplierId;
        if (filters.stockCode) params.stockCode = filters.stockCode;
        if (filters.productMainId) params.productMainId = filters.productMainId;
        if (filters.brandIds) params.brandIds = filters.brandIds.join(',');
        if (filters.status) params.status = filters.status;
        if (filters.nextPageToken) params.nextPageToken = filters.nextPageToken;

        const endpoint = buildApprovedProductsV2Endpoint(this.config.supplierId) + buildQueryString(params);
        return this.get<PaginatedResponseV2<ApprovedProductV2>>(endpoint);
    }

    /**
     * v2 Onaysız Ürün Güncelle
     *
     * Henüz onay almamış ürünlerin tüm bilgilerini günceller.
     *
     * @param data Güncelleme isteği (max 1.000 ürün)
     * @returns batchRequestId içeren yanıt
     *
     * @example
     * ```typescript
     * const result = await client.updateUnapprovedProductV2({
     *     items: [{
     *         barcode: '1234567890',
     *         title: 'Güncellenmiş Başlık',
     *         images: [{ url: 'https://example.com/new-img.jpg' }]
     *     }]
     * });
     * ```
     */
    async updateUnapprovedProductV2(
        data: UpdateUnapprovedProductV2Request
    ): Promise<ApiResponse<BatchRequestResponse>> {
        validateRequired(data.items, 'items');
        const endpoint = buildUpdateUnapprovedProductV2Endpoint(this.config.supplierId);
        return this.post<BatchRequestResponse>(endpoint, data);
    }

    /**
     * v2 Onaylı Ürün Content Güncelle
     *
     * Onaylanmış ürünlerin content bilgilerini günceller (başlık, açıklama, görseller, özellikler).
     * NOT: barcode, productMainId, brandId, categoryId ve slicer/varianter özellikler güncellenemez.
     * NOT: Özellik güncellerken TÜM özellik/değer çiftleri gönderilmelidir.
     *
     * @param data Güncelleme isteği (max 1.000 content)
     * @returns batchRequestId içeren yanıt
     *
     * @example
     * ```typescript
     * const result = await client.updateApprovedContentV2({
     *     items: [{
     *         contentId: 9510902,
     *         title: 'Yeni Başlık',
     *         description: '<p>Yeni açıklama</p>'
     *     }]
     * });
     * ```
     */
    async updateApprovedContentV2(
        data: UpdateApprovedContentV2Request
    ): Promise<ApiResponse<BatchRequestResponse>> {
        validateRequired(data.items, 'items');
        const endpoint = buildUpdateApprovedContentV2Endpoint(this.config.supplierId);
        return this.post<BatchRequestResponse>(endpoint, data);
    }

    /**
     * v2 Onaylı Ürün Varyant Güncelle
     *
     * Onaylanmış ürünlerin varyant bazlı bilgilerini günceller
     * (stokCode, vatRate, dimensionalWeight, lotNumber, adresler vb.).
     *
     * @param data Güncelleme isteği (max 1.000 varyant)
     * @returns batchRequestId içeren yanıt
     *
     * @example
     * ```typescript
     * const result = await client.updateApprovedVariantV2({
     *     items: [{
     *         barcode: '1234567890',
     *         stockCode: 'YENİ-STK-001',
     *         vatRate: 20
     *     }]
     * });
     * ```
     */
    async updateApprovedVariantV2(
        data: UpdateApprovedVariantV2Request
    ): Promise<ApiResponse<BatchRequestResponse>> {
        validateRequired(data.items, 'items');
        const endpoint = buildUpdateApprovedVariantV2Endpoint(this.config.supplierId);
        return this.post<BatchRequestResponse>(endpoint, data);
    }

    /**
     * v2 Teslimat Bilgisi Güncelle
     *
     * Ürünlerin teslimat seçeneklerini günceller (teslimat süresi, hızlı teslimat tipi).
     *
     * @param data Güncelleme isteği (max 1.000 ürün)
     * @returns batchRequestId içeren yanıt
     *
     * @example
     * ```typescript
     * const result = await client.updateDeliveryOptionV2({
     *     items: [{
     *         barcode: '1234567890',
     *         deliveryOption: {
     *             deliveryDuration: 1,
     *             fastDeliveryType: 'SAME_DAY_SHIPPING'
     *         }
     *     }]
     * });
     * ```
     */
    async updateDeliveryOptionV2(
        data: UpdateDeliveryOptionV2Request
    ): Promise<ApiResponse<BatchRequestResponse>> {
        validateRequired(data.items, 'items');
        const endpoint = buildUpdateDeliveryOptionV2Endpoint(this.config.supplierId);
        return this.post<BatchRequestResponse>(endpoint, data);
    }

    // ============================================
    // KATEGORİ İŞLEMLERİ v2
    // ============================================

    /**
     * v2 Kategori Özellik Listesi
     *
     * Belirtilen kategorinin özelliklerini getirir.
     * Yanıtta varianter, slicer, allowCustom, allowMultipleAttributeValues gibi
     * content-based yapıya özel alanlar yer alır.
     *
     * @param categoryId Kategori ID'si
     * @returns Kategori özellik listesi
     *
     * @example
     * ```typescript
     * const attrs = await client.getCategoryAttributesV2(411);
     * attrs.data?.categoryAttributes.forEach(attr => {
     *     console.log(attr.attribute.name, 'Zorunlu:', attr.required, 'Varyant:', attr.varianter);
     * });
     * ```
     */
    async getCategoryAttributesV2(
        categoryId: number
    ): Promise<ApiResponse<CategoryAttributeListV2Response>> {
        validateRequired(categoryId, 'categoryId');
        const endpoint = buildCategoryAttributesV2Endpoint(categoryId);
        return this.get<CategoryAttributeListV2Response>(endpoint);
    }

    /**
     * v2 Kategori Özellik Değerleri Listesi
     *
     * Belirtilen kategori ve özellik için geçerli değerleri sayfalanmış olarak getirir.
     *
     * @param categoryId Kategori ID'si
     * @param attributeId Özellik ID'si
     * @param filters Filtreleme parametreleri (sayfalama, değer adı/ID filtresi)
     * @returns Sayfalanmış özellik değerleri listesi
     *
     * @example
     * ```typescript
     * const values = await client.getCategoryAttributeValuesV2(411, 338, { size: 100 });
     * values.data?.content.forEach(v => {
     *     console.log(v.attributeValueId, v.attributeValueName);
     * });
     * ```
     */
    async getCategoryAttributeValuesV2(
        categoryId: number,
        attributeId: number,
        filters: CategoryAttributeValuesFiltersV2 = {}
    ): Promise<ApiResponse<PaginatedResponseV2<CategoryAttributeValueV2>>> {
        validateRequired(categoryId, 'categoryId');
        validateRequired(attributeId, 'attributeId');

        const params: Record<string, any> = {};
        if (filters.size !== undefined) params.size = Math.min(filters.size, 1000);
        if (filters.page !== undefined) params.page = filters.page;
        if (filters.attributeValueId) params.attributeValueId = filters.attributeValueId;
        if (filters.attributeValueName) params.attributeValueName = filters.attributeValueName;

        const endpoint = buildCategoryAttributeValuesV2Endpoint(categoryId, attributeId) + buildQueryString(params);
        return this.get<PaginatedResponseV2<CategoryAttributeValueV2>>(endpoint);
    }

    // ============================================
    // YARDIMCI METODLAR
    // ============================================

    getSupplierId(): string {
        return this.config.supplierId;
    }

    getEnvironment(): string {
        return this.config.environment;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }
}
