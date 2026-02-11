import * as http from 'http';
import { TrendyolClient } from '../src/client';
import type {
    CreateProductV2Request,
    UpdateUnapprovedProductV2Request,
    UpdateApprovedContentV2Request,
    UpdateApprovedVariantV2Request,
    UpdateDeliveryOptionV2Request,
} from '../src/types';

/**
 * Test sunucusu: TrendyolClient'ın HTTP isteklerini yakalayıp mock yanıt döner.
 */
let server: http.Server;
let basePort: number;
let client: TrendyolClient;

function createMockServer(responseMap: Record<string, { status: number; body: any }>): Promise<number> {
    return new Promise((resolve) => {
        server = http.createServer((req, res) => {
            const url = req.url || '';
            const key = `${req.method} ${url.split('?')[0]}`;

            const mock = responseMap[key] || { status: 404, body: { error: 'Not found' } };
            res.writeHead(mock.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mock.body));
        });

        server.listen(0, () => {
            const addr = server.address();
            const port = typeof addr === 'object' && addr ? addr.port : 0;
            resolve(port);
        });
    });
}

afterEach((done) => {
    if (server) {
        server.close(done);
    } else {
        done();
    }
});

// ============================================
// PRODUCT CREATE V2
// ============================================

describe('createProductV2', () => {
    test('basarili urun olusturma', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/v2/products': {
                status: 200,
                body: { batchRequestId: 'batch-001' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret', environment: 'production' }
        );
        // Override base URL for test
        (client as any).baseUrl = `http://localhost:${port}`;

        const request: CreateProductV2Request = {
            items: [{
                barcode: 'TEST-001',
                title: 'Test Urun',
                description: '<p>Test aciklama</p>',
                productMainId: 'MAIN-001',
                brandId: 1791,
                categoryId: 411,
                quantity: 100,
                stockCode: 'STK-001',
                dimensionalWeight: 2,
                listPrice: 199.99,
                salePrice: 149.99,
                vatRate: 10,
                images: [{ url: 'https://example.com/img.jpg' }],
                attributes: [
                    { attributeId: 338, attributeValueIds: [6980] },
                    { attributeId: 47, attributeValue: 'Ozel Deger' },
                ],
            }],
        };

        const result = await client.createProductV2(request);

        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);
        expect(result.data?.batchRequestId).toBe('batch-001');
    });

    test('undefined items ile hata', async () => {
        const port = await createMockServer({});
        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        await expect(client.createProductV2({ items: undefined as any })).rejects.toThrow();
    });
});

// ============================================
// PRODUCT BASIC INFO V2
// ============================================

describe('getProductBasicInfoV2', () => {
    test('basarili temel bilgi sorgulama', async () => {
        const mockResponse = {
            barcode: 'TEST-001',
            approved: true,
            approvedDate: 1763622556000,
            archived: false,
            listingId: 'a089a30ed1632032913b28099e49d948',
            contentId: 9511264,
        };

        const port = await createMockServer({
            'GET /integration/product/sellers/100/product/TEST-001': {
                status: 200,
                body: mockResponse,
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.getProductBasicInfoV2('TEST-001');

        expect(result.success).toBe(true);
        expect(result.data?.barcode).toBe('TEST-001');
        expect(result.data?.approved).toBe(true);
        expect(result.data?.contentId).toBe(9511264);
        expect(result.data?.listingId).toBe('a089a30ed1632032913b28099e49d948');
    });

    test('bos barcode ile hata', async () => {
        const port = await createMockServer({});
        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        await expect(client.getProductBasicInfoV2('')).rejects.toThrow();
    });
});

// ============================================
// UNAPPROVED PRODUCTS FILTER V2
// ============================================

describe('getUnapprovedProductsV2', () => {
    test('basarili onaysiz urun listeleme', async () => {
        const mockResponse = {
            totalElements: 1,
            totalPages: 1,
            page: 0,
            size: 50,
            content: [{
                supplierId: 100,
                productMainId: 'MAIN-001',
                barcode: 'TEST-001',
                title: 'Test Urun',
                quantity: 50,
                listPrice: 199.99,
                salePrice: 149.99,
                brand: { id: 1791, name: 'Test Marka' },
                category: { id: 411, name: 'Test Kategori' },
                rejectReasonDetails: [
                    { rejectReason: 'Gorsel', rejectReasonDetail: 'Sakincali gorsel' },
                ],
            }],
        };

        const port = await createMockServer({
            'GET /integration/product/sellers/100/products/unapproved': {
                status: 200,
                body: mockResponse,
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.getUnapprovedProductsV2({ status: 'rejected', size: 50 });

        expect(result.success).toBe(true);
        expect(result.data?.totalElements).toBe(1);
        expect(result.data?.content).toHaveLength(1);
        expect(result.data?.content[0].barcode).toBe('TEST-001');
        expect(result.data?.content[0].rejectReasonDetails).toHaveLength(1);
    });
});

// ============================================
// APPROVED PRODUCTS FILTER V2
// ============================================

describe('getApprovedProductsV2', () => {
    test('basarili onayli urun listeleme (content-based)', async () => {
        const mockResponse = {
            totalElements: 1,
            totalPages: 1,
            page: 0,
            size: 50,
            content: [{
                contentId: 9510902,
                productMainId: 'MAIN-001',
                brand: { id: 1791, name: 'Test Marka' },
                category: { id: 411, name: 'Test Kategori' },
                title: 'Test Urun',
                description: '<p>Aciklama</p>',
                images: [{ url: 'https://example.com/img.jpg' }],
                attributes: [{
                    attributeId: 338,
                    attributeName: 'Renk',
                    attributeValues: [{ attributeValueId: 6980, attributeValue: 'Kirmizi' }],
                }],
                variants: [{
                    variantId: 123456,
                    supplierId: 100,
                    barcode: 'TEST-001',
                    onSale: true,
                    price: { salePrice: 149.99, listPrice: 199.99 },
                    stockCode: 'STK-001',
                    vatRate: 10,
                    deliveryOptions: {
                        deliveryDuration: 3,
                        isRushDelivery: false,
                    },
                    archived: false,
                    blacklisted: false,
                    locked: false,
                }],
            }],
        };

        const port = await createMockServer({
            'GET /integration/product/sellers/100/products/approved': {
                status: 200,
                body: mockResponse,
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.getApprovedProductsV2({ status: 'onSale', size: 50 });

        expect(result.success).toBe(true);
        expect(result.data?.content).toHaveLength(1);

        const content = result.data!.content[0];
        expect(content.contentId).toBe(9510902);
        expect(content.variants).toHaveLength(1);
        expect(content.variants![0].barcode).toBe('TEST-001');
        expect(content.variants![0].price?.salePrice).toBe(149.99);
    });

    test('size max 100 ile sinirlanir', async () => {
        const port = await createMockServer({
            'GET /integration/product/sellers/100/products/approved': {
                status: 200,
                body: { totalElements: 0, totalPages: 0, page: 0, size: 100, content: [] },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        // size 500 gonderilse bile 100'e sinirlanmali
        const result = await client.getApprovedProductsV2({ size: 500 });
        expect(result.success).toBe(true);
    });
});

// ============================================
// UPDATE UNAPPROVED PRODUCT V2
// ============================================

describe('updateUnapprovedProductV2', () => {
    test('basarili onaysiz urun guncelleme', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/products/unapproved-bulk-update': {
                status: 200,
                body: { batchRequestId: 'batch-update-001' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const request: UpdateUnapprovedProductV2Request = {
            items: [{
                barcode: 'TEST-001',
                title: 'Guncellenmis Baslik',
                images: [{ url: 'https://example.com/new-img.jpg' }],
            }],
        };

        const result = await client.updateUnapprovedProductV2(request);

        expect(result.success).toBe(true);
        expect(result.data?.batchRequestId).toBe('batch-update-001');
    });
});

// ============================================
// UPDATE APPROVED CONTENT V2
// ============================================

describe('updateApprovedContentV2', () => {
    test('basarili content guncelleme', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/products/content-bulk-update': {
                status: 200,
                body: { batchRequestId: 'batch-content-001' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const request: UpdateApprovedContentV2Request = {
            items: [{
                contentId: 9510902,
                title: 'Yeni Baslik',
                description: '<p>Yeni aciklama</p>',
                images: [{ url: 'https://example.com/updated.jpg' }],
                attributes: [
                    { attributeId: 1, attributeValueIds: [1] },
                    { attributeId: 2, attributeValue: 'Ozel' },
                ],
            }],
        };

        const result = await client.updateApprovedContentV2(request);

        expect(result.success).toBe(true);
        expect(result.data?.batchRequestId).toBe('batch-content-001');
    });
});

// ============================================
// UPDATE APPROVED VARIANT V2
// ============================================

describe('updateApprovedVariantV2', () => {
    test('basarili varyant guncelleme', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/products/variant-bulk-update': {
                status: 200,
                body: { batchRequestId: 'batch-variant-001' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const request: UpdateApprovedVariantV2Request = {
            items: [{
                barcode: 'TEST-001',
                stockCode: 'YENI-STK-001',
                vatRate: 20,
                dimensionalWeight: 3,
            }],
        };

        const result = await client.updateApprovedVariantV2(request);

        expect(result.success).toBe(true);
        expect(result.data?.batchRequestId).toBe('batch-variant-001');
    });
});

// ============================================
// UPDATE DELIVERY OPTION V2
// ============================================

describe('updateDeliveryOptionV2', () => {
    test('basarili teslimat bilgisi guncelleme', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/products/delivery-option-update': {
                status: 200,
                body: { batchRequestId: 'batch-delivery-001' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const request: UpdateDeliveryOptionV2Request = {
            items: [{
                barcode: 'TEST-001',
                deliveryOption: {
                    deliveryDuration: 1,
                    fastDeliveryType: 'SAME_DAY_SHIPPING',
                },
            }],
        };

        const result = await client.updateDeliveryOptionV2(request);

        expect(result.success).toBe(true);
        expect(result.data?.batchRequestId).toBe('batch-delivery-001');
    });
});

// ============================================
// CATEGORY ATTRIBUTES V2
// ============================================

describe('getCategoryAttributesV2', () => {
    test('basarili kategori ozellik listesi', async () => {
        const mockResponse = {
            id: 411,
            name: 'Muay Thai Kaski',
            displayName: 'Muay Thai Kaski',
            categoryAttributes: [
                {
                    allowCustom: false,
                    attribute: { id: 338, name: 'Renk' },
                    categoryId: 411,
                    required: true,
                    varianter: true,
                    slicer: false,
                    allowMultipleAttributeValues: false,
                },
                {
                    allowCustom: true,
                    attribute: { id: 47, name: 'Materyal' },
                    categoryId: 411,
                    required: false,
                    varianter: false,
                    slicer: false,
                    allowMultipleAttributeValues: true,
                },
            ],
        };

        const port = await createMockServer({
            'GET /integration/product/categories/411/attributes': {
                status: 200,
                body: mockResponse,
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.getCategoryAttributesV2(411);

        expect(result.success).toBe(true);
        expect(result.data?.id).toBe(411);
        expect(result.data?.categoryAttributes).toHaveLength(2);

        const colorAttr = result.data!.categoryAttributes[0];
        expect(colorAttr.attribute.name).toBe('Renk');
        expect(colorAttr.required).toBe(true);
        expect(colorAttr.varianter).toBe(true);
        expect(colorAttr.allowMultipleAttributeValues).toBe(false);

        const materialAttr = result.data!.categoryAttributes[1];
        expect(materialAttr.allowCustom).toBe(true);
        expect(materialAttr.allowMultipleAttributeValues).toBe(true);
    });
});

// ============================================
// CATEGORY ATTRIBUTE VALUES V2
// ============================================

describe('getCategoryAttributeValuesV2', () => {
    test('basarili ozellik degerleri listesi', async () => {
        const mockResponse = {
            totalElements: 2,
            totalPages: 1,
            page: 0,
            size: 10,
            content: [
                { attributeValueId: 6980, attributeValueName: 'Kirmizi' },
                { attributeValueId: 6981, attributeValueName: 'Mavi' },
            ],
        };

        const port = await createMockServer({
            'GET /integration/product/categories/411/attributes/338/values': {
                status: 200,
                body: mockResponse,
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.getCategoryAttributeValuesV2(411, 338, { size: 10 });

        expect(result.success).toBe(true);
        expect(result.data?.totalElements).toBe(2);
        expect(result.data?.content).toHaveLength(2);
        expect(result.data?.content[0].attributeValueName).toBe('Kirmizi');
    });

    test('bos categoryId ile hata', async () => {
        const port = await createMockServer({});
        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        await expect(
            client.getCategoryAttributeValuesV2(null as any, 338)
        ).rejects.toThrow();
    });
});

// ============================================
// ERROR HANDLING
// ============================================

describe('V2 Error Handling', () => {
    test('401 unauthorized', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/v2/products': {
                status: 401,
                body: { error: 'Unauthorized', message: 'Invalid credentials' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'wrong', apiSecret: 'wrong' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.createProductV2({
            items: [{
                barcode: 'X',
                title: 'X',
                description: 'X',
                productMainId: 'X',
                brandId: 1,
                categoryId: 1,
                quantity: 1,
                stockCode: 'X',
                dimensionalWeight: 1,
                listPrice: 10,
                salePrice: 10,
                vatRate: 10,
                images: [{ url: 'https://example.com/x.jpg' }],
                attributes: [{ attributeId: 1, attributeValueIds: [1] }],
            }],
        });

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(401);
    });

    test('400 validation error', async () => {
        const port = await createMockServer({
            'POST /integration/product/sellers/100/v2/products': {
                status: 400,
                body: { error: 'Bad Request', message: 'listPrice cannot be less than salePrice' },
            },
        });

        client = new TrendyolClient(
            { supplierId: '100', apiKey: 'key', apiSecret: 'secret' }
        );
        (client as any).baseUrl = `http://localhost:${port}`;

        const result = await client.createProductV2({
            items: [{
                barcode: 'X',
                title: 'X',
                description: 'X',
                productMainId: 'X',
                brandId: 1,
                categoryId: 1,
                quantity: 1,
                stockCode: 'X',
                dimensionalWeight: 1,
                listPrice: 5,
                salePrice: 10,
                vatRate: 10,
                images: [{ url: 'https://example.com/x.jpg' }],
                attributes: [{ attributeId: 1, attributeValueIds: [1] }],
            }],
        });

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);
    });
});
