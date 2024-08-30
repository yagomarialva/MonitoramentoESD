import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
} from "@mui/material";
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

const ESDForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [station, setStation] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Regex para verificar se o campo começa com espaços em branco
    const startsWithWhitespace = /^\s+/.test(value);
    setErrors((prev) => ({
      ...prev,
      [name]: startsWithWhitespace
        ? "É necessário que o campo não comece com espaço em branco."
        : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasErrors = Object.values(errors).some((error) => error);

    if (hasErrors) return;

    try {
      await onSubmit(station);
      handleClose();
    } catch (error) {
      console.error("Error creating bracelet:", error);
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("ESD_TEST.DIALOG.CREATE_STATION", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label={t("ESD_TEST.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="description"
            name="description"
            label={t("ESD_TEST.TABLE.NAME", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={Boolean(errors.description)}
            helperText={errors.description}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
              variant="contained"
              color="error"
              sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
            >
               {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, ml: 2, display: "flex", justifyContent: "flex-end" }}
            >
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDForm;
