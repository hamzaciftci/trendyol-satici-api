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
export class TrendyolClient {
    private config: Required<TrendyolConfig>;
    private baseUrl: string;
    private authHeader: string;

    constructor(config: TrendyolConfig) {
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
                headers: {
                    'Authorization': this.authHeader,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'User-Agent': 'TrendyolSaticiAPI/1.0',
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
    // ÜRÜN İŞLEMLERİ
    // ============================================

    /**
     * Ürünleri listele
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
     * Barkodla ürün ara
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
     * Kategori özelliklerini getir
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
