import React, { useState } from 'react';

import { UploadIcon } from './FileUploadIcons';
import { useFileUploader } from './useFileUploader';
import { validateFiles } from './useFileValidation';

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
    validationErrors?: string[];
    testId?: string; // Add testId prop
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
    validationErrors: validationErrorsProp,
    testId, // Destructure testId
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationErrorsState, setValidationErrors] = useState<string[]>([]);
    const validationErrors = validationErrorsProp !== undefined ? validationErrorsProp : validationErrorsState;
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

    // Add focus management and keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            const inputElement = document.getElementById(id) as HTMLInputElement | null;
            if (inputElement) {
                inputElement.click();
            }
        }
    };

    return (
        <div className={`file-upload ${className} flex flex-col items-center`}>
            <label
                htmlFor={id}
                className="file-upload-label border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 w-full"
                aria-label={label}
            >
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    className="w-full flex flex-col items-center justify-center outline-none"
                >
                    <UploadIcon size={40} className="text-blue-500 mb-2" ariaLabel="Upload icon" />
                    <span className="text-sm text-gray-600" aria-hidden="true">
                        {label}
                    </span>
                    <span className="text-xs text-gray-400 mt-1" aria-hidden="true">
                        {multiple ? 'Drag files here or click to browse' : 'Drag a file here or click to browse'}
                    </span>
                </div>
                <input
                    type="file"
                    id={id}
                    accept={acceptedFileTypes}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-describedby="file-upload-description"
                    data-testid={testId || id} // Use testId if provided, else id
                />
            </label>

            {validationErrors.length > 0 && (
                <ul className="text-red-500 mt-2 text-xs" aria-live="polite">
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
                    aria-disabled={uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            )}

            {uploadStatus === 'uploading' && (
                <div
                    className="w-full bg-gray-200 rounded-full h-2.5 mt-2"
                    role="progressbar"
                    aria-valuenow={uploadProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
            )}

            {uploadStatus === 'success' && (
                <div className="text-green-500 mt-2 text-sm" role="status">
                    Files uploaded successfully!
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="text-red-500 mt-2 text-sm" role="alert">
                    Error uploading files. Please try again.
                </div>
            )}
        </div>
    );
};

export default FileUpload;
