import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
  Alert,
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

const OperatorForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [station, setStation] = useState({
    name: "",
    badge: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^(?![\s-]+$)[\w-]{1,50}$/;

    if (!nameRegex.test(station.name)) {
      setError(
       "Nome inválido. O nome deve conter apenas letras, números, hífens e underscores, e não pode ser composto apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }

    setError("");

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
      <Paper sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {t("ESD_OPERATOR.ADD_OPERATOR", {
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
            label={t("ESD_OPERATOR.TABLE.NAME", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={!!error}
            helperText={error}
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
            error={!!error}
            helperText={error}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
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
