import React, { useState, useEffect } from "react";
import { Typography, Box, Paper } from "@mui/material";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import ButtonBootstrap from "react-bootstrap/Button";
import ModalBootstrap from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";

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

const ESDEditForm = ({ open, handleClose, onSubmit, initialData }) => {
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


  const [bracelet, setBracelet] = useState({
    userId: "",
    title: "",
    completed: false,
  });

  useEffect(() => {
    if (initialData) {
      setBracelet(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBracelet((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(bracelet);
      handleClose();
    } catch (error) {
      console.error("Error creating or updating bracelet:", error);
    }
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
          Station {bracelet.title}
        </ModalBootstrap.Title>
        <Box component="form" onSubmit={handleSubmit}>
          <ModalBootstrap.Body>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                required
                id="outlined-userId"
                label={t("ESD_TEST.TABLE.USER_ID", {
                  appName: "App for Translations",
                })}
                name="userId"
                value={bracelet.userId}
                onChange={handleChange}
                fullWidth
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                required
                id="outlined-title"
                label={t("ESD_TEST.TABLE.NAME", {
                  appName: "App for Translations",
                })}
                name="title"
                value={bracelet.title}
                onChange={handleChange}
                fullWidth
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                required
                id="outlined-completed"
                label="Completed"
                name="completed"
                value={bracelet.completed}
                onChange={handleChange}
                fullWidth
              />
            </Typography>
          </ModalBootstrap.Body>
          <ModalBootstrap.Footer>
            <ButtonBootstrap style={{ marginTop: "10px", marginLeft: "4px" }} variant="secondary" onClick={handleClose}>
            {t("ESD_TEST.DIALOG.CLOSE", {
                appName: "App for Translations",
              })}
            </ButtonBootstrap>
            <ButtonBootstrap style={{ marginTop: "10px", marginLeft: "4px" }} variant="success" type="submit">
            {t("ESD_TEST.DIALOG.SAVE", {
                appName: "App for Translations",
              })}
            </ButtonBootstrap>
          </ModalBootstrap.Footer>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDEditForm;
