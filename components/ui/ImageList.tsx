import ShowImage from "./showImage";

export type ImageListParams = {
    id?: string;
}

const ImageList = () => {
    return (
        <div>
            <ShowImage />
            <ShowImage />
        </div>
    )
}

export default ImageList;