import { useState } from "react";

const ImageUpload = () => {
    const [file, setFile] = useState("");

    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    function handleUpload() {
        if (!file) {
            alert("Please choose a file first!")
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