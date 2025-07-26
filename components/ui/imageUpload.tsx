import { useState } from "react";

const ImageUpload = () => {
    const [, setFile] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files[0].name);
    }
    
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <button>Upload to Firebase</button>
        </div>
    )
}

export default ImageUpload;