import React, { useState } from 'react';

import { FileIcon } from './FileUpload/FileUploadIcons';

interface FileListViewProps {
    files: { name: string; size: number }[];
    loading: boolean;
    error: string | null;
    deleteFile: (fileName: string) => Promise<void>;
}

const FileListView: React.FC<FileListViewProps> = ({ files, loading, error, deleteFile }) => {
    const [sortBy, setSortBy] = useState<'type' | 'name'>('type');

    if (loading) {
        return <div>Loading files...</div>;
    }
    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
    if (files.length === 0) {
        return <div>No files uploaded yet.</div>;
    }

    // Sort files based on user selection
    const sortedFiles = [...files].sort((a, b) => {
        if (sortBy === 'type') {
            const extA = a.name.split('.').pop()?.toLowerCase() || '';
            const extB = b.name.split('.').pop()?.toLowerCase() || '';
            if (extA < extB) {
                return -1;
            }
            if (extA > extB) {
                return 1;
            }
            return a.name.localeCompare(b.name);
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    return (
        <div>
            <div className="mb-2 text-left">
                <label htmlFor="sort-files" className="mr-2 font-medium text-sm text-gray-700">
                    Sort by:
                </label>
                <select
                    id="sort-files"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'type' | 'name')}
                    className="border rounded px-2 py-1 text-sm"
                >
                    <option value="type">File Type</option>
                    <option value="name">File Name</option>
                </select>
            </div>
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {sortedFiles.map((file, idx) => (
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
                        {file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|pdf)$/i) ? (
                            <a
                                href={`/uploads/${encodeURIComponent(file.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Open
                            </a>
                        ) : (
                            <a
                                href={`/uploads/${encodeURIComponent(file.name)}`}
                                download
                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Download
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileListView;
