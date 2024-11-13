import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const DeleteModal = ({ onAccept, onClose, show }) => {
  return (
    <Modal
    show={show}
      title="Warning"
      themeClass="bg-warning-500"
      footerContent={
        <>
          <Button
            text="Yes"
            className="btn-warning"
            onClick={() => {
              onAccept();
              onClose(); // Close the modal after accepting
            }}
          />
          <Button text="No" onClick={onClose} className="ml-2" />
        </>
      }
    >
      <h4 className="font-medium text-lg mb-3 text-slate-900">Attention Required</h4>
      <div className="text-base text-slate-600 dark:text-slate-300">
        Are you sure you want to delete this?
      </div>
    </Modal>
  );
};

export default DeleteModal;