import React, { useState } from 'react';

import { UploadIcon } from './FileUploadIcons';
import './FileUpload.css';
import { validateFiles } from './useFileValidation';
import { useFileUploader } from './useSingleFileUploader';

export interface FileUploadProps {
    onFileSelect?: (files: File[]) => void;
    onUploadComplete?: () => void;
    multiple?: boolean;
    acceptedFileTypes?: string;

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
    maxSizeMB = 5,
    label = 'Upload File',
    id = 'file-upload',
    uploadUrl,
    autoUpload = false,
    className = '',
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const { uploading, uploadProgress, uploadStatus, uploadFiles } = useFileUploader({
        uploadUrl: uploadUrl || '',
        onUploadComplete,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            const { validFiles, errors } = validateFiles(fileArray, acceptedFileTypes, maxSizeMB);
            setSelectedFiles(validFiles);
            setValidationErrors(errors);
            if (onFileSelect) {
                onFileSelect(validFiles);
            }
            if (autoUpload && uploadUrl && validFiles.length > 0) {
                uploadFiles(validFiles, id);
            }
        }
    };

    const handleUploadClick = () => {
        if (selectedFiles.length > 0 && uploadUrl) {
            uploadFiles(selectedFiles, id);
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

            {validationErrors.length > 0 && (
                <ul className="text-red-500 mt-2 text-xs">
                    {validationErrors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
            )}

            {uploadUrl && !autoUpload && selectedFiles.length > 0 && (
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
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="text-green-500 mt-2 text-sm">Files uploaded successfully!</div>
            )}

            {uploadStatus === 'error' && (
                <div className="text-red-500 mt-2 text-sm">Error uploading files. Please try again.</div>
            )}
        </div>
    );
};

export default FileUpload;
