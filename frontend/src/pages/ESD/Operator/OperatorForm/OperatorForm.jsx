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
import "./OperatorForm.css"; // Importe o arquivo CSS

const OperatorForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [station, setStation] = useState({
    name: "",
    badge: "",
  });

  const [errorName, setErrorName] = useState("");
  const [errorBadge, setErrorBadge] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors on input change
    if (name === "name") {
      setErrorName("");
    }
    if (name === "badge") {
      setErrorBadge("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^(?![\s-]+$)[\w\s-]{1,50}$/;
    const badgeRegex = /^[\w\s-]{1,50}$/;

    let valid = true;

    if (!station.name) {
      setErrorName("Este campo é obrigatório.");
      valid = false;
    } else if (!nameRegex.test(station.name)) {
      setErrorName(
        "Nome inválido. O nome deve conter apenas letras, números, hífens e underscores, e não pode ser composto apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      valid = false;
    } else {
      setErrorName("");
    }

    if (!station.badge) {
      setErrorBadge("Este campo é obrigatório.");
      valid = false;
    } else if (!badgeRegex.test(station.badge)) {
      setErrorBadge(
        "Matricula inválida, deve ter no máximo 50 caracteres."
      );
      valid = false;
    } else {
      setErrorBadge("");
    }

    if (!valid) return;

    try {
      await onSubmit(station);
      handleClose();
    } catch (error) {
      console.error("Error creating operator:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper className="modal-paper">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("ESD_OPERATOR.ADD_OPERATOR", { appName: "App for Translations" })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="name"
            name="name"
            label={t("ESD_OPERATOR.TABLE.NAME", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={!!errorName}
            helperText={errorName || "Este campo é obrigatório."}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="badge"
            name="badge"
            label={t("ESD_OPERATOR.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={!!errorBadge}
            helperText={errorBadge || "Este campo é obrigatório."}
          />
          <Box className="modal-buttons">
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              className="modal-submit-button"
            >
              {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              className="modal-submit-button"
            >
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default OperatorForm;
