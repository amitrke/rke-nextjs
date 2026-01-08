import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";
import { Image } from "react-bootstrap";
import { ImageSize, imageSizeMap, fileNameToNameWithDimensions, getImageBucketUrl } from "./imageUtils";

// Re-export for backwards compatibility
export { imageSizeMap, fileNameToNameWithDimensions, getImageBucketUrl };

export type ImageDownloadParams = {
    file?: string;
    size?: ImageSize;
    userId?: string;
}
export type ShowImageParams = ImageDownloadParams & {
    imageUrl?: string;
    classes?: string;
}

export type ImageDownloadURLResponse = {
    key: string;
    url: string;
    size: string;
    error?: string;
}

export async function getImageDownloadURLV2(params: ImageDownloadParams): Promise<ImageDownloadURLResponse> {
    const storage = getStorage();
    const filenameParts = params.file.split(".");
    const fileExtention = filenameParts.pop();
    const size = params.size ? params.size : "m";
    const fileName = `${filenameParts[0]}_${imageSizeMap[size]['w']}x${imageSizeMap[size]['h']}.${fileExtention}`;
    try {
        const downloadUrl = await getDownloadURL(ref(storage, fileName));
        if (downloadUrl) {
            return {
                url: downloadUrl, key: params.file, size: size
            };
        }
    } catch (error) {
        // Log error for debugging, but return fallback image for user experience
        console.error(`Failed to load image ${fileName}:`, error);
        return {
            url: '/no-image.png', key: params.file, size: size
        };
    }
}

/**
 * @deprecated use getImageDownloadURLV2
 */
export async function getImageDownloadURL(params: ImageDownloadParams): Promise<string> {
    const storage = getStorage();
    const filenameParts = params.file.split(".");
    const fileExtention = filenameParts.pop();
    const size = params.size ? params.size : "m";
    const fileName = `${filenameParts[0]}_${imageSizeMap[size]['w']}x${imageSizeMap[size]['h']}.${fileExtention}`;
    try {
        const downloadUrl = await getDownloadURL(ref(storage, fileName));
        if (downloadUrl) {
            return downloadUrl;
        }
    } catch {
        return '/no-image.png';
    }
}

/*
* @deprecated use ShowImage2
*/
const ShowImage = (props: ShowImageParams) => {
    const size = props.size ? props.size : "m";
    let classes = props.classes ? props.classes : "";
    
    if (size === "s" && classes.indexOf("img-thumbnail") === -1) {
        classes += " img-thumbnail";
    }
    
    const [imageUrl, setImageUrl] = useState<string>();

    useEffect(() => {
        const getUrl = async () => {
            if (props.imageUrl) {
                setImageUrl(props.imageUrl);
                return;
            }
            if (props.file) {
                const url = await getImageDownloadURL({ ...props });
                setImageUrl(url);
            }
        };
        getUrl();
    }, [props.imageUrl, props.file, props.size, props.userId]);

    return (
        <ShowImageRaw imageUrl={imageUrl} size={size} classes={classes} />
    )
    
}

export const ShowImageRaw = (props: ShowImageParams) => {

    if (!props.imageUrl) {
        return (
            <div>
                Placeholder
            </div>
        )
    }

    return (
        <Image src={props.imageUrl} alt="" className={props.classes} fluid />
    )
}

export default ShowImage;