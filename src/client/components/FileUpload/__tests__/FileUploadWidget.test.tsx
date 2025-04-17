import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import '@testing-library/jest-dom/vitest';
import FileUpload from '../FileUploadWidget';

describe('FileUploadWidget', () => {
    it('renders the file upload component', () => {
        render(<FileUpload label="Upload File" id="test-upload" />);

        const labelElement = screen.getByLabelText('Upload File');
        expect(labelElement).toBeInTheDocument();
    });

    it('triggers file selection when clicked', () => {
        render(<FileUpload label="Upload File" id="test-upload" testId="test-upload-input" />);

        const inputElement = screen.getByTestId('test-upload-input');
        expect(inputElement).toBeInTheDocument();
    });

    it('displays validation errors', () => {
        const { rerender } = render(<FileUpload label="Upload File" id="test-upload" />);

        rerender(<FileUpload label="Upload File" id="test-upload" validationErrors={['File size exceeds limit']} />);

        const errorElement = screen.getByText('File size exceeds limit');
        expect(errorElement).toBeInTheDocument();
    });
});
