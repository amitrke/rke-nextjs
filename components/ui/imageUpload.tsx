import { useState } from "react";

const ImageUpload = () => {
    const [, setFile] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0].name);
        } else {
            setFile("");
        }
    }
    
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <button>Upload to Firebase</button>
        </div>
    )
}

export default ImageUpload;