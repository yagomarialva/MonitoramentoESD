import React, { useState } from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LockOutlined } from "@ant-design/icons";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import "./LineForm.css";

// Definindo a interface para as propriedades do componente
interface LineFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (line: Line) => Promise<void>;
}

// Definindo a interface para o estado do line
interface Line {
  name: string;
  description?: string; // descrição opcional, se necessário
}

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

const LineForm: React.FC<LineFormProps> = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [line, setLine] = useState<Line>({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLine((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await onSubmit(line);
      handleClose();
    } catch (error) {
      console.error("Error creating line:", error);
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
        <Typography
          variant="h6"
          id="contained-modal-title-vcenter"
          gutterBottom
          className="user-icon-container"
        >
          <LineAxisIcon className="user-icon" />
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-name"
              name="name"
              label={t("LINE.ADD_LINE", {
                appName: "App for Translations",
              })}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Typography>
          <Box className="button-container">
            <Button
              type="submit" // Botão muda para submit no modo de edição
              variant="contained"
              color="success"
              className="custom-button custom-font-edit"
            >
              {t("LINE.DIALOG.SAVE", { appName: "App for Translations" })}
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="success"
              onClick={handleClose} // Fecha o modal
              className="custom-button custom-font"
            >
              {t("LINE.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default LineForm;
