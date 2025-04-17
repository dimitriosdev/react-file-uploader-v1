import { useState } from 'react';

import DemoUploader from './components/DemoUploader';
import FileListView from './components/FileListView';

export const App = () => {
    const [page, setPage] = useState<'upload' | 'files'>('upload');

    return (
        <main className="relative isolate h-dvh">
            <img
                src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2FjY291bnRzXC82ZVwvNDAwMDM4OFwvcHJvamVjdHNcLzk4NFwvYXNzZXRzXC9iOFwvMTE1MjY1XC8xMjYwMTU0YzFhYmVmMDVjNjZlY2Q2MDdmMTRhZTkxNS0xNjM4MjU4MjQwLmpwZyJ9:weare:_kpZgwnGPTxOhYxIyfS1MhuZmxGrFCzP6ZW6dc-F6BQ?width=2400"
                alt="background image"
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
            />

            <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">File Uploader Demo</h1>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${page === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setPage('upload')}
                    >
                        Upload Files
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${page === 'files' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setPage('files')}
                    >
                        View Files
                    </button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {page === 'upload' ? <DemoUploader /> : <FileListView />}
                </div>
            </div>
        </main>
    );
};
