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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Section */}
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

                {/* Files List Section */}
                <div className="files-list-container p-4 bg-white rounded-lg shadow border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-800">Uploaded Files</h2>
                        <button
                            onClick={() => setRefreshKey((prevKey) => prevKey + 1)}
                            className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                        >
                            Refresh
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : uploadedFiles.length > 0 ? (
                        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center bg-gray-50 p-3 rounded">
                                    <FileIcon className="text-gray-500 mr-3" size={18} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-6 text-gray-500">No files uploaded yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemoUploader;
