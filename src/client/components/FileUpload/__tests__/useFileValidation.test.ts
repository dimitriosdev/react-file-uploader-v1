import { describe, it, expect } from 'vitest';

import { validateFiles } from '../useFileValidation';

describe('validateFiles', () => {
    it('accepts valid files', () => {
        const file = new File(['data'], 'image.png', { type: 'image/png' });
        const result = validateFiles([file], 'image/*', 5);
        expect(result.validFiles).toHaveLength(1);
        expect(result.errors).toHaveLength(0);
    });

    it('rejects files with invalid type', () => {
        const file = new File(['data'], 'doc.txt', { type: 'text/plain' });
        const result = validateFiles([file], 'image/*', 5);
        expect(result.validFiles).toHaveLength(0);
        expect(result.errors[0]).toMatch(/Invalid file type/);
    });

    it('rejects files exceeding max size', () => {
        const file = new File(['a'.repeat(6 * 1024 * 1024)], 'big.png', { type: 'image/png' });
        const result = validateFiles([file], 'image/*', 5);
        expect(result.validFiles).toHaveLength(0);
        expect(result.errors[0]).toMatch(/File size exceeds/);
    });
});
