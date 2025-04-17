// Utility for validating files before upload
export interface FileValidationResult {
    validFiles: File[];
    errors: string[];
}

export function validateFiles(files: File[], acceptedTypes: string, maxSizeMB: number): FileValidationResult {
    const validFiles: File[] = [];
    const errors: string[] = [];
    const accepted = acceptedTypes.split(',').map((type) => type.trim());

    for (const file of files) {
        // Type validation
        if (
            acceptedTypes !== '*' &&
            !accepted.some((type) => file.type.match(type) || file.name.endsWith(type.replace('.*', '')))
        ) {
            errors.push(`${file.name}: Invalid file type.`);
            continue;
        }
        // Size validation
        if (file.size > maxSizeMB * 1024 * 1024) {
            errors.push(`${file.name}: File size exceeds ${maxSizeMB}MB.`);
            continue;
        }
        validFiles.push(file);
    }
    return { validFiles, errors };
}
