/**
 * Shared utilities for image handling across the application.
 * Consolidates duplicate code from showImage.tsx and showImage2.tsx.
 */

export type ImageSize = 's' | 'm' | 'l';

export const imageSizeMap: Record<ImageSize, { w: number; h: number }> = {
    s: {
        w: 200,
        h: 200
    },
    m: {
        w: 680,
        h: 680
    },
    l: {
        w: 1920,
        h: 1080
    }
};

/**
 * Converts a filename to include dimension suffix based on size.
 * Example: "image.jpg" with size "m" becomes "image_680x680.jpg"
 */
export const fileNameToNameWithDimensions = (fileName: string, size: ImageSize = 'm'): string => {
    const lastDot = fileName.lastIndexOf('.');
    const baseName = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;
    const fileExtension = lastDot !== -1 ? fileName.slice(lastDot + 1) : '';
    return `${baseName}_${imageSizeMap[size].w}x${imageSizeMap[size].h}.${fileExtension}`;
};

/**
 * Sanitizes a filename to be URL-safe: lowercased, spaces → hyphens, special chars stripped.
 * Used before uploading to Firebase Storage to prevent broken image URLs.
 */
export const sanitizeFilename = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    const ext = lastDot !== -1 ? filename.slice(lastDot + 1).toLowerCase() : '';
    const base = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
    const safeName = base
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return ext ? `${safeName}.${ext}` : safeName;
};

/**
 * Gets the direct bucket URL for an image in Firebase Storage.
 * This bypasses the Firebase SDK and uses the public bucket URL directly.
 */
export const getImageBucketUrl = (fileName: string, size: ImageSize, userId: string): string => {
    const fileNameWithDimensions = fileNameToNameWithDimensions(fileName, size);
    return `https://storage.googleapis.com/rkeorg.appspot.com/users/${userId}/images/${encodeURIComponent(fileNameWithDimensions)}`;
};
