import React, { useEffect, useState } from 'react';

import { FileIcon } from './FileUpload/Icons';

interface FileInfo {
    name: string;
    size: number;
}

const UploadedFilesList: React.FC = () => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/files');
                if (!response.ok) {
                    throw new Error('Failed to fetch files');
                }
                const data = await response.json();
                setFiles(data.files || []);
            } catch (e) {
                setFiles([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    if (loading) {
        return <div>Loading files...</div>;
    }
    if (files.length === 0) {
        return <div>No files uploaded yet.</div>;
    }

    return (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {files.map((file, idx) => (
                <li key={idx} className="flex items-center bg-gray-50 p-3 rounded">
                    <FileIcon className="text-gray-500 mr-3" size={18} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default UploadedFilesList;
