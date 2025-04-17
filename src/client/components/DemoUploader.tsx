import React, { useEffect, useState } from 'react';

import FileUpload from './FileUpload/FileUpload';
import { FileIcon } from './FileUpload/Icons';

interface FileInfo {
    name: string;
    size: number;
}

interface ApiResponse {
    files: FileInfo[];
}

const DemoUploader: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch uploaded files from the server
    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/files');
                if (!response.ok) {
                    throw new Error(`Failed to fetch files: ${response.status}`);
                }
                const data = (await response.json()) as ApiResponse;
                setUploadedFiles(data.files || []);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchFiles();
    }, [refreshKey]);

    const handleFilesUploaded = () => {
        // Refresh the file list after upload
        setRefreshKey((prevKey) => prevKey + 1);
    };

    return (
        <div className="demo-container">
            <div className="grid grid-cols-1 gap-6">
                <div className="upload-container p-4 bg-white rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Upload Files</h2>
                    <div className="image-upload-demo">
                        <FileUpload
                            onFileSelect={(files) => {
                                console.log('Selected files:', files);
                            }}
                            onUploadComplete={handleFilesUploaded}
                            multiple={true}
                            acceptedFileTypes="*"
                            maxSizeMB={5}
                            label="Upload Files"
                            id="file-upload"
                            uploadUrl="/api/upload-single"
                            autoUpload={true}
                            className="image-upload"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoUploader;
