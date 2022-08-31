import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

export type ToastMsgProps = {
    header: string;
    body: string;
}

const ToastMsg = (props: ToastMsgProps) => {

    const [show, setShow] = useState<boolean>(true);

    const onClose = () => {
        setShow(false);
    }

    return (
        <Toast show={show} onClose={onClose}>
            <Toast.Header>
                {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
                <strong className="me-auto">{props.header}</strong>
                <small>1 min ago</small>
            </Toast.Header>
            <Toast.Body>{props.body}</Toast.Body>
        </Toast>
    );
}

export default ToastMsg;