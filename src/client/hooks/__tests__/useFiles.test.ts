import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useFiles } from '../useFiles';

// Mock fetch globally for all tests
beforeEach(() => {
    global.fetch = vi.fn((_input: RequestInfo, init?: RequestInit) => {
        if (init && init.method === 'DELETE') {
            return Promise.resolve({ ok: true }) as unknown as Response;
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ files: [{ name: 'file1.txt', size: 1234 }] }),
        }) as unknown as Response;
    }) as unknown as typeof fetch;
});
afterEach(() => {
    vi.clearAllMocks();
});

describe('useFiles', () => {
    it('fetches files on mount', async () => {
        const { result } = renderHook(() => useFiles());
        await act(async () => {}); // allow useEffect to run
        expect(result.current.files).toEqual([{ name: 'file1.txt', size: 1234 }]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('handles deleteFile', async () => {
        const { result } = renderHook(() => useFiles());
        await act(async () => {
            await result.current.deleteFile('file1.txt');
        });
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/files/file1.txt',
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    it('handles fetch error', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        (global.fetch as unknown as { mockImplementationOnce: Function }).mockImplementationOnce(() =>
            Promise.resolve({ ok: false })
        );

        const { result } = renderHook(() => useFiles());
        await act(async () => {});
        expect(result.current.error).toBe('Failed to fetch files');
        expect(result.current.files).toEqual([]);
    });
});
