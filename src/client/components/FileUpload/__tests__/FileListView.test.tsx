import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import FileListView from '../../FileListView';

describe('FileListView', () => {
    const files = [
        { name: 'b.pdf', size: 1000 },
        { name: 'a.jpg', size: 2000 },
        { name: 'c.txt', size: 3000 },
    ];
    const deleteFile = vi.fn();

    it('renders loading state', () => {
        render(<FileListView files={[]} loading={true} error={null} deleteFile={deleteFile} />);
        expect(screen.getByText(/loading files/i)).toBeInTheDocument();
    });

    it('renders error state', () => {
        render(<FileListView files={[]} loading={false} error="Some error" deleteFile={deleteFile} />);
        expect(screen.getByText(/error: some error/i)).toBeInTheDocument();
    });

    it('renders empty state', () => {
        render(<FileListView files={[]} loading={false} error={null} deleteFile={deleteFile} />);
        expect(screen.getByText(/no files uploaded yet/i)).toBeInTheDocument();
    });

    it('renders files and allows sorting', () => {
        render(<FileListView files={files} loading={false} error={null} deleteFile={deleteFile} />);
        // Default sort is by type
        const items = screen.getAllByRole('listitem');
        expect(items[0]).toHaveTextContent('a.jpg');
        expect(items[1]).toHaveTextContent('b.pdf');
        expect(items[2]).toHaveTextContent('c.txt');
        // Change sort to name
        fireEvent.change(screen.getByLabelText(/sort by/i), { target: { value: 'name' } });
        const itemsByName = screen.getAllByRole('listitem');
        expect(itemsByName[0]).toHaveTextContent('a.jpg');
        expect(itemsByName[1]).toHaveTextContent('b.pdf');
        expect(itemsByName[2]).toHaveTextContent('c.txt');
    });

    it('shows Open for images and pdfs, Download for others', () => {
        render(<FileListView files={files} loading={false} error={null} deleteFile={deleteFile} />);
        const items = screen.getAllByRole('listitem');
        expect(items[0]).toHaveTextContent('a.jpg');
        expect(items[0]).toHaveTextContent('Open');
        expect(items[1]).toHaveTextContent('b.pdf');
        expect(items[1]).toHaveTextContent('Open');
        expect(items[2]).toHaveTextContent('c.txt');
        expect(items[2]).toHaveTextContent('Download');
    });

    it('calls deleteFile when Delete is clicked', () => {
        render(<FileListView files={files} loading={false} error={null} deleteFile={deleteFile} />);
        fireEvent.click(screen.getAllByText('Delete')[0]);
        expect(deleteFile).toHaveBeenCalled();
    });
});
