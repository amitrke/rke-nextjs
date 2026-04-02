// to learn how to download a file, get/use file metadata, delete files, and list files see https://firebase.google.com/docs/storage/web/start

import { useRef, useState } from 'react'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { getFirebaseStorage } from '../../firebase/initFirebase'
import { useUser } from '../../firebase/useUser'
import { ToastMsgProps } from '../ui/toastMsg'
import { sanitizeFilename } from '../ui/imageUtils'

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
        const file = inputEl.current.files[0]

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            props.toastCallback({body: "Failed to upload, FileType should be jpeg or png", header: "Image Upload"});
            inputEl.current.value = null
            return;
        }

        // create a storage ref
        const storage = getFirebaseStorage();
        const safeFilename = sanitizeFilename(file.name);
        const storageRef = ref(storage, `users/${user.id}/upload/${safeFilename}`)

        // upload file
        const uploadTask = uploadBytesResumable(storageRef, file)

        // update progress bar
        uploadTask.on('state_changed',
            (snapshot) => {
                // progress
                setValue((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            },
            async (err) => {
                // error
                console.error(err);
                await props.statusCallback({filename: safeFilename, status: false})
                props.toastCallback({body: err.message, header: "Image Upload"});
            },
            async () => {
                // complete
                await props.statusCallback({filename: safeFilename, status: true})
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