// to learn how to download a file, get/use file metadata, delete files, and list files see https://firebase.google.com/docs/storage/web/start

import { useRef, useState } from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { useUser } from '../../firebase/useUser'
import { ToastMsgProps } from '../ui/toastMsg'

export type UploadStatusType = {
    status: boolean;
    filename: string;
}

type UploadFileParam = {
    toastCallback: (props: ToastMsgProps) => Promise<void>
    disabled: boolean
    statusCallback?: (props: UploadStatusType) => void
}

const UploadFile = (props: UploadFileParam) => {
    const inputEl = useRef(null)
    const [value, setValue] = useState(0)
    const { user } = useUser();

    function uploadFile() {
        if (!user) return;

        // get file
        var file = inputEl.current.files[0]

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            props.toastCallback({body: "Failed to upload, FileType should be jpeg or png", header: "Image Upload"});
            inputEl.current.value = null
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

            async function error(err) {
                console.error(err);
                await props.statusCallback({filename: file.name, status: false})
                props.toastCallback({body: err.message, header: "Image Upload"});
            },

            async function compleete() {
                await props.statusCallback({filename: file.name, status: true})
                props.toastCallback({body: 'Uploaded to firebase storage successfully!', header: "Image Upload"});
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
                disabled={props.disabled}
            />
        </div>
    )
}

export default UploadFile