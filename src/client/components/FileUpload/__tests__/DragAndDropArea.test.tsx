import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import DragAndDropArea from '../DragAndDropArea';

describe('DragAndDropArea', () => {
    it('calls onFiles with dropped files', () => {
        const onFiles = vi.fn();
        const file = new File(['file-content'], 'test.txt', { type: 'text/plain' });
        const { getByTestId } = render(
            <DragAndDropArea onFiles={onFiles} multiple={true} acceptedFileTypes="*" maxSizeMB={5}>
                <div data-testid="drop-area">Drop here</div>
            </DragAndDropArea>
        );
        const dropArea = getByTestId('drop-area');
        fireEvent.dragOver(dropArea);
        fireEvent.drop(dropArea, {
            dataTransfer: {
                files: [file],
                items: [],
                types: ['Files'],
            },
        });
        expect(onFiles).toHaveBeenCalledWith([file]);
    });

    it('shows drag active class on drag over', () => {
        const { container } = render(
            <DragAndDropArea onFiles={() => {}} multiple={true} acceptedFileTypes="*" maxSizeMB={5}>
                <div>Drop here</div>
            </DragAndDropArea>
        );
        const dropArea = container.firstChild as HTMLElement;
        fireEvent.dragOver(dropArea);
        // The parent div should have the ring-2 ring-blue-400 class
        expect(dropArea).toHaveClass('ring-2', 'ring-blue-400');
    });
});
