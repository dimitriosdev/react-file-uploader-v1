import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFileUploader } from '../useFileUploader';

beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true })) as unknown as typeof fetch;
});
afterEach(() => {
    vi.clearAllMocks();
});

describe('useFileUploader', () => {
    it('should initialize with default state', () => {
        const { result } = renderHook(() => useFileUploader({ uploadUrl: '/api/upload' }));
        expect(result.current.uploading).toBe(false);
        expect(result.current.uploadProgress).toBe(0);
        expect(result.current.uploadStatus).toBe('idle');
    });

    it('should not upload if no files are provided', async () => {
        const { result } = renderHook(() => useFileUploader({ uploadUrl: '/api/upload' }));
        await act(async () => {
            await result.current.uploadFiles([]);
        });
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should upload files and update state', async () => {
        const { result } = renderHook(() => useFileUploader({ uploadUrl: '/api/upload' }));
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        await act(async () => {
            await result.current.uploadFiles([file]);
        });
        expect(global.fetch).toHaveBeenCalled();
        expect(result.current.uploadStatus).toBe('success');
        expect(result.current.uploadProgress).toBe(100);
    });

    it('should set error status on upload failure', async () => {
        (global.fetch as unknown as { mockImplementationOnce: Function }).mockImplementationOnce(() =>
            Promise.resolve({ ok: false, status: 500 })
        );
        const { result } = renderHook(() => useFileUploader({ uploadUrl: '/api/upload' }));
        const file = new File(['fail'], 'fail.txt', { type: 'text/plain' });
        await act(async () => {
            await result.current.uploadFiles([file]);
        });
        expect(result.current.uploadStatus).toBe('error');
    });
});
