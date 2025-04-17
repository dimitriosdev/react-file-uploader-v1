import React, { useState } from 'react';

interface DragAndDropAreaProps {
    onFiles: (files: File[]) => void;
    multiple: boolean;
    acceptedFileTypes: string;
    maxSizeMB: number;
    children: React.ReactNode;
}

const DragAndDropArea: React.FC<DragAndDropAreaProps> = ({ onFiles, multiple, children }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const files = Array.from(event.dataTransfer.files);
        if (!multiple && files.length > 1) {
            onFiles([files[0]]);
        } else {
            onFiles(files);
        }
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };
    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={dragActive ? 'ring-2 ring-blue-400' : ''}
            style={{ width: '100%' }}
        >
            {children}
        </div>
    );
};

export default DragAndDropArea;
