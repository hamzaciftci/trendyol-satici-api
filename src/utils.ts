/**
 * Trendyol API Utilities
 * 
 * @author Hamza ÇİFTÇİ <hamzaciftci80@gmail.com>
 * @license MIT
 * @see https://github.com/hamzaciftci/trendyol-api-client
 */

// ============================================
// DATE UTILITIES
// ============================================

export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export function dateToTimestamp(date: string | Date): number {
    if (date instanceof Date) {
        return date.getTime();
    }
    
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
    }
    
    return parsedDate.getTime();
}

export function timestampToDate(timestamp: number): Date {
    return new Date(timestamp);
}

export function timestampToISO(timestamp: number): string {
    return new Date(timestamp).toISOString();
}

export function daysAgo(days: number): number {
    return Date.now() - (days * 24 * 60 * 60 * 1000);
}

export function startOfToday(): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
}

export function endOfToday(): number {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now.getTime();
}

// ============================================
// QUERY STRING UTILITIES
// ============================================

export function buildQueryString(params: Record<string, any>): string {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    
    return filtered.length > 0 ? '?' + filtered.join('&') : '';
}

export function buildPaginationParams(page?: number, size?: number): Record<string, number> {
    const params: Record<string, number> = {};
    
    if (page !== undefined) {
        params.page = page;
    }
    
    if (size !== undefined) {
        params.size = Math.min(size, 200);
    }
    
    return params;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

export function validateRequired(value: any, paramName: string): void {
    if (value === undefined || value === null || value === '') {
        throw new Error(`Required parameter "${paramName}" is missing or empty`);
    }
}

export function validateSupplierId(supplierId: string): void {
    if (!supplierId || !/^\d+$/.test(supplierId)) {
        throw new Error('Invalid supplier ID format. Must be numeric.');
    }
}

// ============================================
// RESPONSE UTILITIES
// ============================================

export function extractContent<T>(response: any): T[] {
    if (Array.isArray(response)) {
        return response;
    }
    
    if (response.content && Array.isArray(response.content)) {
        return response.content;
    }
    
    if (response.products && Array.isArray(response.products)) {
        return response.products;
    }
    
    if (response.brands && Array.isArray(response.brands)) {
        return response.brands;
    }
    
    if (response.categories && Array.isArray(response.categories)) {
        return response.categories;
    }
    
    if (response.questions && Array.isArray(response.questions)) {
        return response.questions;
    }
    
    return [];
}

export function isPaginated(response: any): boolean {
    return response && 
           typeof response.totalPages === 'number' && 
           typeof response.totalElements === 'number';
}
