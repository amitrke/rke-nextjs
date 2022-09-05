import ShowImage from "./showImage";

export type ImageListParams = {
    id?: string;
}

const ImageList = (params: ImageListParams) => {
    return (
        <div>
            <ShowImage />
            <ShowImage />
        </div>
    )
}

export default ImageList;