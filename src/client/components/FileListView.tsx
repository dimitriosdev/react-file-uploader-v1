import React from 'react';

import { useFiles } from '../hooks/useFiles';

import { FileIcon } from './FileUpload/FileUploadIcons';

const FileListView: React.FC = () => {
    const { files, loading, error, deleteFile } = useFiles();

    if (loading) {
        return <div>Loading files...</div>;
    }
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
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
                    <button
                        onClick={() => deleteFile(file.name)}
                        className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default FileListView;
