import Image from "next/image";
import { ImageSize, getImageBucketUrl } from "./imageUtils";

// Re-export for backwards compatibility
export { getImageBucketUrl };

export type ImageDownloadParams = {
    file: string;
    size?: ImageSize;
    userId: string;
}
export type ShowImageParams = ImageDownloadParams & {
    imageUrl?: string;
    classes?: string;
    width: number;
    height: number;
}

export type ImageDisplayType = {
    key?: string;
    url: string;
    width?: number;
    height?: number;
}

export type ImageDownloadURLResponse = {
    key: string;
    url: string;
    size: string;
    error?: string;
}

const ShowImage2 = (props: ShowImageParams) => {
    const size = props.size ? props.size : "m";
    let classes = props.classes ? props.classes : "";

    if (size === "s" && classes.indexOf("img-thumbnail") === -1) {
        classes += " img-thumbnail";
    }

    const url = getImageBucketUrl(props.file, size, props.userId);
    if (props.width && props.height) {
        return (
            <Image src={url} alt="" className={classes} width={props.width} height={props.height} unoptimized />
        )
    } else {
        return (
            <Image src={url} alt="" className={classes} fill unoptimized />
        )
    }
}

export default ShowImage2;