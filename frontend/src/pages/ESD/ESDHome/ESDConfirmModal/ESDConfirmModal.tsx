import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import ButtonBootstrap from "react-bootstrap/Button";
import './ESDConfirmModal.css'; // Import the CSS file

interface ESDConfirmModalProps {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  title: string;
  description: string;
}

const ESDConfirmModal: React.FC<ESDConfirmModalProps> = ({
  open,
  handleClose,
  handleConfirm,
  title,
  description,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-container">
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Typography className="modal-description">
          {description}
        </Typography>
        <Box className="modal-buttons">
          <ButtonBootstrap
            className="cancel-button"
            variant="outline-success"
            onClick={handleClose}
          >
            Cancel
          </ButtonBootstrap>
          <ButtonBootstrap
            className="delete-button"
            variant="danger"
            onClick={handleConfirm}
          >
            Delete
          </ButtonBootstrap>
        </Box>
      </Box>
    </Modal>
  );
};

export default ESDConfirmModal;
