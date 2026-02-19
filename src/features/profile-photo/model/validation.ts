// File validation for profile photo uploads

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateProfilePhoto = (file: File): FileValidationResult => {
    // Check if file exists
    if (!file) {
        return { isValid: false, error: "validation.fileRequired" };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: "validation.fileTooLarge" };
    }

    // Check file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return { isValid: false, error: "validation.invalidFileType" };
    }

    return { isValid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
