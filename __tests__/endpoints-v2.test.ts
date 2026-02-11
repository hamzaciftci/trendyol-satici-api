import {
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
} from '../src/endpoints';

describe('V2 Endpoint Builders', () => {
    const sellerId = '123456';

    test('buildCreateProductV2Endpoint', () => {
        expect(buildCreateProductV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/v2/products');
    });

    test('buildProductBasicInfoV2Endpoint', () => {
        expect(buildProductBasicInfoV2Endpoint(sellerId, 'BARCODE-001'))
            .toBe('/integration/product/sellers/123456/product/BARCODE-001');
    });

    test('buildUnapprovedProductsV2Endpoint', () => {
        expect(buildUnapprovedProductsV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/unapproved');
    });

    test('buildApprovedProductsV2Endpoint', () => {
        expect(buildApprovedProductsV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/approved');
    });

    test('buildUpdateUnapprovedProductV2Endpoint', () => {
        expect(buildUpdateUnapprovedProductV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/unapproved-bulk-update');
    });

    test('buildUpdateApprovedContentV2Endpoint', () => {
        expect(buildUpdateApprovedContentV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/content-bulk-update');
    });

    test('buildUpdateApprovedVariantV2Endpoint', () => {
        expect(buildUpdateApprovedVariantV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/variant-bulk-update');
    });

    test('buildUpdateDeliveryOptionV2Endpoint', () => {
        expect(buildUpdateDeliveryOptionV2Endpoint(sellerId))
            .toBe('/integration/product/sellers/123456/products/delivery-option-update');
    });

    test('buildCategoryAttributesV2Endpoint', () => {
        expect(buildCategoryAttributesV2Endpoint(411))
            .toBe('/integration/product/categories/411/attributes');
    });

    test('buildCategoryAttributeValuesV2Endpoint', () => {
        expect(buildCategoryAttributeValuesV2Endpoint(411, 338))
            .toBe('/integration/product/categories/411/attributes/338/values');
    });
});
