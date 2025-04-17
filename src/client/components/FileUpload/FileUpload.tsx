import React, { useState } from 'react';

import { FileIcon, UploadIcon } from './Icons';
import './FileUpload.css';

export interface FileUploadProps {
    onFileSelect?: (files: File[]) => void;
    onUploadComplete?: () => void;
    multiple?: boolean;
    acceptedFileTypes?: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxSizeMB?: number;
    label?: string;
    id?: string;
    uploadUrl?: string;
    autoUpload?: boolean;
    className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    onUploadComplete,
    multiple = false,
    acceptedFileTypes = 'image/*',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxSizeMB = 5,
    label = 'Upload File',
    id = 'file-upload',
    uploadUrl,
    autoUpload = false,
    className = '',
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);

            if (onFileSelect) {
                onFileSelect(fileArray);
            }

            if (autoUpload && uploadUrl) {
                void uploadFiles(fileArray);
            }
        }
    };

    const uploadFiles = async (files: File[]) => {
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

            const data = (await response.json()) as { message: string };
            console.log('Upload successful:', data);
            setUploadStatus('success');

            // Notify parent component that upload is complete
            if (onUploadComplete) {
                onUploadComplete();
            }

            // Reset file selection after successful upload
            setSelectedFiles([]);
            // Reset the file input
            if (document.getElementById(id) instanceof HTMLInputElement) {
                (document.getElementById(id) as HTMLInputElement).value = '';
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('error');
        } finally {
            setUploading(false);
            setUploadProgress(100);
        }
    };

    const handleUploadClick = () => {
        if (selectedFiles.length > 0 && uploadUrl) {
            void uploadFiles(selectedFiles);
        }
    };

    return (
        <div className={`file-upload ${className} flex flex-col items-center`}>
            <label
                htmlFor={id}
                className="file-upload-label border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 w-full"
            >
                <UploadIcon size={40} className="text-blue-500 mb-2" />
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-xs text-gray-400 mt-1">
                    {multiple ? 'Drag files here or click to browse' : 'Drag a file here or click to browse'}
                </span>
                <input
                    type="file"
                    id={id}
                    accept={acceptedFileTypes}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>

            {selectedFiles.length > 0 && (
                <div className="selected-files mt-4 w-full">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
                    <ul className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
                                <FileIcon className="text-gray-500 mr-2" size={18} />
                                <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                <span className="text-xs text-gray-400 ml-auto">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </li>
                        ))}
                    </ul>

                    {uploadUrl && !autoUpload && (
                        <button
                            onClick={handleUploadClick}
                            disabled={uploading}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    )}

                    {uploadStatus === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    )}

                    {uploadStatus === 'success' && (
                        <div className="text-green-500 mt-2 text-sm">Files uploaded successfully!</div>
                    )}

                    {uploadStatus === 'error' && (
                        <div className="text-red-500 mt-2 text-sm">Error uploading files. Please try again.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
