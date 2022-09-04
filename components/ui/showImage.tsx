import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Figure, Image } from "react-bootstrap";

const storage = getStorage();

const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-8 -8 40 40' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-image'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1, e2, e3) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

const rgbDataURL = (r, g, b) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

export type ShowImageParams = {
    file?: string;
    size?: "s" | "m" | "l";
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

const ShowImage = (props: ShowImageParams) => {
    const size = props.size ? props.size : "m";
    const [imageUrl, setImageUrl] = useState<string>();
    
    const getUrl = async() => {
        if (props.file){
            const filenameParts = props.file.split(".");
            const fileExtention = filenameParts.pop();
            const fileName = `${filenameParts[0]}_${imageSizeMap[size]['w']}x${imageSizeMap[size]['h']}.${fileExtention}`;
            const downloadUrl = await getDownloadURL(ref(storage, fileName));
            if (downloadUrl) {
                setImageUrl(downloadUrl);
            }
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
        <Image src={imageUrl} width={imageSizeMap[size]['w']}/>
    )
}

export default ShowImage;