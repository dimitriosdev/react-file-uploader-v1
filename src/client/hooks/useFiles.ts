import { useCallback, useEffect, useState } from 'react';

export interface FileInfo {
    name: string;
    size: number;
}

interface UseFilesResult {
    files: FileInfo[];
    loading: boolean;
    error: string | null;
    refresh: () => void;
    deleteFile: (fileName: string) => Promise<void>;
}

export function useFiles(): UseFilesResult {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    const deleteFile = async (fileName: string): Promise<void> => {
        try {
            const response = await fetch(`/api/files/${fileName}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }

            refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        }
    };

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        fetch('/api/files')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }
                return response.json();
            })
            .then((data: { files: FileInfo[] }) => {
                if (isMounted) {
                    setFiles(data.files || []);
                }
            })
            .catch((error_: unknown) => {
                if (isMounted) {
                    setError(error_ instanceof Error ? error_.message : 'Unknown error');
                }
                setFiles([]);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [refreshKey]);

    return { files, loading, error, refresh, deleteFile };
}
