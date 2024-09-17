import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ButtonBootstrap from "react-bootstrap/Button";
import { LockOutlined } from "@ant-design/icons";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "./LineConfirmModal.css";
import { useTranslation } from "react-i18next";

const LineConfirmModal = ({
  open,
  handleClose,
  handleConfirm,
  title,
  description,
}) => {
  const { t } = useTranslation();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...modalStyle }}>
        <Typography
          variant="h6"
          id="contained-modal-title-vcenter"
          gutterBottom
          className="user-icon-container"
          component="h2"
        >
          <DeleteOutlineOutlinedIcon className="user-icon-delete" />
        </Typography>
        <Typography id="modal-modal-description" className="ant-modal-content" sx={{ mt: 2, ml:10 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            className="custom-button custom-font-edit"
            variant="outline-success"
            onClick={handleClose}
            sx={{ mr: 1 }}
          >
            {t("LINE.CONFIRM_DIALOG.CLOSE", { appName: "App for Translations" })}
          </Button>
          <Button
            className="custom-button custom-font-delete"
            variant="contained"
            color="success"
            onClick={handleConfirm}
          >
            {t("LINE.CONFIRM_DIALOG.SAVE", { appName: "App for Translations" })}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LineConfirmModal;
