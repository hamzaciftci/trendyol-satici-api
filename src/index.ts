/**
 * Trendyol Satıcı API
 * Trendyol Marketplace satıcıları için TypeScript API client
 *
 * @author Hamza ÇİFTÇİ <hamzaciftci80@gmail.com>
 * @license MIT
 * @see https://github.com/hamzaciftci/trendyol-satici-api
 *
 * @example
 * ```typescript
 * import { TrendyolClient } from 'trendyol-satici-api';
 *
 * const client = new TrendyolClient({
 *     supplierId: 'TEDARIKCI_ID',
 *     apiKey: 'API_ANAHTARI',
 *     apiSecret: 'API_GIZLI_ANAHTARI',
 *     environment: 'production'
 * });
 *
 * // Ürünleri çek
 * const urunler = await client.getProducts({ size: 10 });
 *
 * // Siparişleri çek
 * const siparisler = await client.getRecentOrders(7);
 *
 * // Müşteri sorularını çek
 * const sorular = await client.getUnansweredQuestions();
 * ```
 */

export { TrendyolClient } from './client';
export * from './types';
export * from './endpoints';
export * from './utils';
