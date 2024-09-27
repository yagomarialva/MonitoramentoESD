import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Divider, // Importando o Divider
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./MonitorForm.css"; // Importando o arquivo CSS

interface Monitor {
  id: number;
  serialNumber: string;
  description: string;
  statusOperador: string;
  statusJig: string;
}

interface MonitorFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (monitor: Monitor) => Promise<void>;
}

const MonitorForm: React.FC<MonitorFormProps> = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [monitor, setMonitor] = useState<Monitor>({
    id: 0,
    serialNumber: "",
    description: "",
    statusOperador: "",
    statusJig: "",
  });
  
  const [error, setError] = useState<string>("");
  const [errorName, setErrorName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as HTMLInputElement | { name: string; value: unknown };
    setMonitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          {/* Column headers */}
          <Typography className="form-header">Número de Série</Typography>
          <Typography className="form-header">Descrição</Typography>
          <Typography className="form-header">Status Operador</Typography>
          <Typography className="form-header">Status JIG</Typography>
          
          {/* Linha divisória */}

          {/* Inputs below the headers */}
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
              onChange={handleChange} // Usando a função handleChange atualizada
              label="Status Operador"
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
              onChange={handleChange} // Usando a função handleChange atualizada
              label="Status JIG"
            >
              <MenuItem value="PASS">Pass</MenuItem>
              <MenuItem value="FAIL">Fail</MenuItem>
            </Select>
          </FormControl>

          {/* Buttons */}
          <Box className="button-container">
            <Button onClick={handleCloseModal} variant="contained" color="error">
              {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
            <Button type="submit" variant="contained" color="success" className="submit-button">
              {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default MonitorForm;
