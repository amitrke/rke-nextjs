import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Figure, Image } from "react-bootstrap";

export type ImageDownloadParams = {
    file?: string;
    size?: "s" | "m" | "l";
}
export type ShowImageParams = ImageDownloadParams & {
    imageUrl?: string;
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
        h: 1280
    }
}

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

    if (!imageUrl) {
        return (
            <div>
                Placeholder
            </div>
        )
    }

    return (
        <Image src={imageUrl} width={imageSizeMap[size]['w']} />
    )
}

export default ShowImage;