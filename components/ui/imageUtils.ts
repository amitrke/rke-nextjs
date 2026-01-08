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
    const filenameParts = fileName.split(".");
    const fileExtension = filenameParts.pop();
    return `${filenameParts[0]}_${imageSizeMap[size].w}x${imageSizeMap[size].h}.${fileExtension}`;
};

/**
 * Gets the direct bucket URL for an image in Firebase Storage.
 * This bypasses the Firebase SDK and uses the public bucket URL directly.
 */
export const getImageBucketUrl = (fileName: string, size: ImageSize, userId: string): string => {
    const fileNameWithDimensions = fileNameToNameWithDimensions(fileName, size);
    return `https://storage.googleapis.com/rkeorg.appspot.com/users/${userId}/images/${fileNameWithDimensions}`;
};
