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
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import "./MonitorForm.css"; // Importando o arquivo CSS

const MonitorForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [monitor, setMonitor] = useState({
    serialNumber: "",
    description: "",
    statusOperador: "",
    statusJig: "",
  });
  const [error, setError] = useState("");
  const [errorName, setErrorName] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMonitor((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameRegex = /^(?![\s-]+$)[\w-]{1,50}$/;

    if (!nameRegex.test(monitor.serialNumber)) {
      setErrorName(
        "Número inválido. O nome deve conter apenas letras, números, hífens e underscores, e não pode ser composto apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }
    if (!nameRegex.test(monitor.description)) {
      setError(
        "Descrição inválida. A descrição deve conter apenas letras, números, hífens e underscores, e não pode ser composta apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }
    setError("");
    setErrorName("");
    try {
      await onSubmit(monitor);
      handleClose();
    } catch (error) {
      console.error("Error creating monitor:", error);
    }
  };

  const handleCloseModal = () => {
    setError("");
    setErrorName("");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper className="modal-container">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adicionar Monitor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="form-container">
          {/* Cabeçalhos das colunas */}
          <Typography className="form-header">Número de Série</Typography>
          <Typography className="form-header">Descrição</Typography>
          <Typography className="form-header">Status Operador</Typography>
          <Typography className="form-header">Status JIG</Typography>

          {/* Inputs abaixo dos cabeçalhos */}
          <TextField
            required
            className="text-field"
            id="serialNumber"
            name="serialNumber"
            onChange={handleChange}
            error={!!errorName}
            helperText={errorName}
          />
          <TextField
            required
            className="text-field"
            id="description"
            name="description"
            onChange={handleChange}
            error={!!error}
            helperText={error}
          />
          <FormControl className="select-field" required>
            <InputLabel id="statusOperador">Status Operador</InputLabel>
            <Select
              labelId="statusOperador"
              id="statusOperador"
              name="statusOperador"
              value={monitor.statusOperador}
              onChange={handleChange}
              label="statusOperador"
            >
              <MenuItem value="PASS">Pass</MenuItem>
              <MenuItem value="FAIL">Fail</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="select-field" required>
            <InputLabel id="statusJig">Status JIG</InputLabel>
            <Select
              labelId="statusJig"
              id="statusJig"
              name="statusJig"
              value={monitor.statusJig}
              onChange={handleChange}
              label="statusJig"
            >
              <MenuItem value="PASS">Pass</MenuItem>
              <MenuItem value="FAIL">Fail</MenuItem>
            </Select>
          </FormControl>

          {/* Botões */}
          <Box className="button-container">
            <Button
              onClick={handleClose}
              variant="contained"
              color="error"
            >
              {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              className="submit-button"
            >
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorForm;
