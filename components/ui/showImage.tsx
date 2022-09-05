import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Figure, Image } from "react-bootstrap";

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
    const storage = getStorage();
    
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