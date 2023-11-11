import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Image } from "react-bootstrap";

export type ImageDownloadParams = {
    file?: string;
    size?: "s" | "m" | "l";
}
export type ShowImageParams = ImageDownloadParams & {
    imageUrl?: string;
    classes?: string;
}

const imageSizeMap = {
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
            return {url: downloadUrl, key: params.file, size: size };
        }
    } catch (err) {
        console.error(err)
        return {url: '/no-image.png', key: params.file, size: size, error: err.message };
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
    } catch (err) {
        return '/no-image.png';
    }
}

const ShowImage = (props: ShowImageParams) => {
    const size = props.size ? props.size : "m";
    let classes = props.classes ? props.classes : "";
    const [imageUrl, setImageUrl] = useState<string>();

    const getUrl = async () => {
        if (props.imageUrl) {
            setImageUrl(props.imageUrl)
            return;
        }
        if (props.file) {
            const url = await getImageDownloadURL({...props})
            setImageUrl(url)
        }
    }

    getUrl();

    if (size === "s" && classes.indexOf("img-thumbnail") === -1) {
        classes += " img-thumbnail";
    }

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
        <Image src={props.imageUrl} alt="" className={props.classes} fluid/>
    )
}

export default ShowImage;