import { useState } from 'react';

export interface UseFileUploaderOptions {
    uploadUrl: string;
    onUploadComplete?: () => void;
}

export interface UseFileUploaderResult {
    uploading: boolean;
    uploadProgress: number;
    uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
    uploadFiles: (files: File[], inputId?: string) => Promise<void>;
}

export function useFileUploader({ uploadUrl, onUploadComplete }: UseFileUploaderOptions): UseFileUploaderResult {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const uploadFiles = async (files: File[], inputId?: string) => {
        if (!uploadUrl || files.length === 0) {
            return;
        }
        setUploading(true);
        setUploadStatus('uploading');
        setUploadProgress(0);
        try {
            const formData = new FormData();
            for (const file of files) {
                formData.append('file', file, file.name);
            }
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
            setUploadStatus('success');
            if (onUploadComplete) {
                onUploadComplete();
            }
            // Reset file input if provided
            if (inputId && document.getElementById(inputId) instanceof HTMLInputElement) {
                (document.getElementById(inputId) as HTMLInputElement).value = '';
            }
        } catch (error) {
            setUploadStatus('error');
        } finally {
            setUploading(false);
            setUploadProgress(100);
        }
    };

    return { uploading, uploadProgress, uploadStatus, uploadFiles };
}
