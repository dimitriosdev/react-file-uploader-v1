import DemoUploader from './components/DemoUploader';
import FileListView from './components/FileListView';
import { useFiles } from './hooks/useFiles';

export const App = () => {
    const { files, loading, error, refresh, deleteFile } = useFiles();
    return (
        <main className="relative isolate h-dvh" role="main">
            <a href="#content" className="sr-only focus:not-sr-only">
                Skip to Content
            </a>
            <img
                src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2FjY291bnRzXC82ZVwvNDAwMDM4OFwvcHJvamVjdHNcLzk4NFwvYXNzZXRzXC9iOFwvMTE1MjY1XC8xMjYwMTU0YzFhYmVmMDVjNjZlY2Q2MDdmMTRhZTkxNS0xNjM4MjU4MjQwLmpwZyJ9:weare:_kpZgwnGPTxOhYxIyfS1MhuZmxGrFCzP6ZW6dc-F6BQ?width=2400"
                alt="background image"
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
            />

            <div id="content" className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">File Uploader Demo</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <DemoUploader refresh={refresh} />
                    <div className="my-8 border-t border-gray-200"></div>
                    <FileListView files={files} loading={loading} error={error} deleteFile={deleteFile} />
                </div>
            </div>
        </main>
    );
};
