import React from 'react';

import { FileUploadWidget } from './FileUpload';

interface DemoUploaderProps {
    refresh: () => void;
}

const DemoUploader: React.FC<DemoUploaderProps> = ({ refresh }) => {
    const handleFilesUploaded = () => {
        refresh();
    };

    return (
        <div className="demo-container">
            <div className="grid grid-cols-1 gap-6">
                <div className="upload-container p-4 bg-white rounded-lg shadow border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-800 mb-4">Upload Files</h2>
                    <div className="image-upload-demo">
                        <FileUploadWidget
                            onFileSelect={(files) => {
                                console.log('Selected files:', files);
                            }}
                            onUploadComplete={handleFilesUploaded}
                            multiple={true}
                            acceptedFileTypes="image/*,application/pdf"
                            maxSizeMB={5}
                            label="Upload Files"
                            id="file-upload"
                            uploadUrl="/api/upload-single"
                            autoUpload={true}
                            className="image-upload"
                            testId="file-upload-input"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemoUploader;
