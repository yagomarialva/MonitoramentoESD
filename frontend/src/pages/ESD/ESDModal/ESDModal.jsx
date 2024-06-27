import React from "react";
import { Typography, Paper } from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBootstrap from "react-bootstrap/Button";
import ModalBootstrap from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ESDModal = ({ open, handleClose, bracelet }) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  // eslint-disable-next-line no-unused-vars
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <ModalBootstrap.Title id="contained-modal-title-vcenter">
          Bracelet {bracelet.title}
        </ModalBootstrap.Title>
        <ModalBootstrap.Body>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              disabled
              required
              id="outlined-required"
              label={t("ESD_TEST.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              defaultValue={bracelet.userId}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              disabled
              required
              id="outlined-required"
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={bracelet.title}
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              disabled
              required
              id="outlined-required"
              label="Completed"
              defaultValue={bracelet.completed}
            />
          </Typography>
        </ModalBootstrap.Body>
        <ModalBootstrap.Footer>
          <ButtonBootstrap
            variant="success"
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            {t("ESD_TEST.DIALOG.CLOSE", {
                appName: "App for Translations",
              })}
          </ButtonBootstrap>
        </ModalBootstrap.Footer>
      </Paper>
    </Modal>
  );
};

export default ESDModal;
