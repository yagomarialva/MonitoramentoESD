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

const MonitorForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [monitor, setMonitor] = useState({
    serialNumber: "",
    description: "",
    status: "",
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
      <Paper sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Adicionar Monitor
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            required
            fullWidth
            margin="normal"
            id="serialNumber"
            name="serialNumber"
            label={t("ESD_TEST.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            onChange={handleChange}
            error={!!errorName}
            helperText={errorName}
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
            error={!!error}
            helperText={error}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              name="status"
              value={monitor.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="PASS">Pass</MenuItem>
              <MenuItem value="FAIL">Fail</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="statusOperador">Status JIG</InputLabel>
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
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
              onClick={handleClose}
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
            >
                 {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 2, ml:2 }}
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
