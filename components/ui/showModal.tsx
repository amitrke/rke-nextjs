import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export type ShowModalParams = {
    yesCallback: () => Promise<void>
    noCallback?: () => Promise<void>
    yesLabel?: string
    noLabel?: string
    heading?: string
    body?: string
    show: boolean
    changeTrigger?: Date
}

const ShowModal = (props: ShowModalParams) => {
  const [show, setShow] = useState(props.show);

  const handleClose = () => setShow(false);

  const onYes = () => {
    props.yesCallback();
    handleClose();
  }

  useEffect(() => {
    setShow(props.show);
  }, [props.changeTrigger])

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShowModal;