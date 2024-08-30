import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  FormControl,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./OperatorEditForm.css"; // Importando o arquivo CSS

const OperatorEditForm = ({ open, handleClose, onSubmit, initialData }) => {
  const { t } = useTranslation();

  const [operator, setOperator] = useState({
    name: "",
    badge: "",
  });

  const [errorName, setErrorName] = useState("");

  useEffect(() => {
    if (initialData) {
      setOperator(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOperator((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors on input change
    if (name === "name") {
      setErrorName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^(?![\s-]+$)[\w-]{1,50}$/;

    if (!nameRegex.test(operator.name)) {
      setErrorName(
        "Nome inválido. O nome deve conter apenas letras, números, hífens e underscores, e não pode ser composto apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }

    setErrorName("");

    try {
      await onSubmit(operator);
      handleClose();
    } catch (error) {
      console.error("Error creating or updating operator:", error);
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
          {t("ESD_OPERATOR.DIALOG.EDIT_OPERATOR", {
            appName: "App for Translations",
          })}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <FormControl fullWidth margin="normal">
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-name"
              name="name"
              label={t("ESD_OPERATOR.TABLE.NAME", {
                appName: "App for Translations",
              })}
              value={operator.name}
              onChange={handleChange}
              error={!!errorName}
              helperText={errorName || "Este campo é obrigatório."}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-badge"
              name="badge"
              label={t("ESD_OPERATOR.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              disabled
              value={operator.badge}
            />
          </FormControl>
          <Box className="modal-buttons">
            <Button onClick={handleClose} variant="contained" color="error">
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

export default OperatorEditForm;
