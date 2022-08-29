// to learn how to download a file, get/use file metadata, delete files, and list files see https://firebase.google.com/docs/storage/web/start

import { useRef, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useUser } from '../../firebase/useUser'
import { ToastMsgProps } from '../ui/toastMsg'

type UploadFileParam = {
    toastCallback: (props: ToastMsgProps) => void
}

const UploadFile = (props: UploadFileParam) => {
    const inputEl = useRef(null)
    const [value, setValue] = useState(0)
    const { user } = useUser();

    function uploadFile() {
        if (!user) return;

        // get file
        var file = inputEl.current.files[0]

        console.log(`FileType=${file.type}`);

        if (file.type !== 'image/png' || file.type !== 'image/jpeg') {
            props.toastCallback({body: "FileType should be jpeg or png", header: "Incorrect file type"});
            return;
        }

        
        // create a storage ref
        var storageRef = firebase.storage().ref(`users/${user.id}/upload/` + file.name)

        // upload file
        var task = storageRef.put(file)

        // update progress bar
        task.on('state_change',

            function progress(snapshot) {
                setValue((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },

            function error(err) {
                alert(error)
            },

            function compleete() {
                alert('Uploaded to firebase storage successfully!')
            }
        )
    }

    return (
        <div style={{ margin: '5px 0' }}>
            <progress value={value} max="100" style={{width: '100%'}}></progress>
            <br />
            <input
                type="file"
                onChange={uploadFile}
                ref={inputEl}
            />
        </div>
    )
}

export default UploadFile