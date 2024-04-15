import Image from "next/image";
import probe from "probe-image-size";

export type ImageDownloadParams = {
    file: string;
    size?: "s" | "m" | "l";
    userId: string;
}
export type ShowImageParams = ImageDownloadParams & {
    imageUrl?: string;
    classes?: string;
    width: number;
    height: number;
}

export type ImageDisplayType = {
    url: string;
    width?: number;
    height?: number;
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

const fileNameToNameWithDimensions = (fileName: string, size: string = 'm') => {
    const filenameParts = fileName.split(".");
    const fileExtention = filenameParts.pop();
    return `${filenameParts[0]}_${imageSizeMap[size]['w']}x${imageSizeMap[size]['h']}.${fileExtention}`;
}

export const getImageBucketUrl = (fileName: string, size: string, userId: string) => {
    const fileNameWithDimensions = fileNameToNameWithDimensions(fileName, size);
    return `https://storage.googleapis.com/rkeorg.appspot.com/users/${userId}/images/${fileNameWithDimensions}`
}

export const getImageSizes = async (imageUrl: string[], userId: string): Promise<ImageDisplayType[]> => {
    const sizes = imageUrl.map(async (url) => {
        const { width , height } = await probe(getImageBucketUrl(url, "m", userId));
        return { url, width, height };
    });
    return await Promise.all(sizes);
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