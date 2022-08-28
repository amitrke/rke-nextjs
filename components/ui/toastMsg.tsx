import Toast from 'react-bootstrap/Toast';

export type ToastMsgProps = {
    header: string;
    body: string;
    show: boolean;
}

const ToastMsg = (props: ToastMsgProps) => {

    return (
        <Toast show={props.show}>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                <strong className="me-auto">{props.header}</strong>
                <small>1 min ago</small>
            </Toast.Header>
            <Toast.Body>{props.body}</Toast.Body>
        </Toast>
    );
}

export default ToastMsg;