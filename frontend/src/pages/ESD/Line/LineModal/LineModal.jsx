import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LockOutlined } from "@ant-design/icons";
import InputAdornment from "@mui/material/InputAdornment";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import { updateLine } from "../../../../api/linerApi";
import "./LineModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const LineModal = ({ open, handleClose, onSubmit, line }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false); // Estado de edição inicializado como false
  const [station, setStation] = useState({
    name: "",
  });

  useEffect(() => {
    setIsEditing(false)
    if (line) {
      setStation(line);
    }
  }, [line]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log('here', isEditing)
    e.preventDefault();
    try {
      await onSubmit(station);
        handleClose();
    } catch (error) {
      console.error("Error creating or updating station:", error);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do botão de editar
    setIsEditing(!isEditing); // Alterna o modo de edição
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
              disabled={!isEditing} // O campo é desativado quando não está em edição
              fullWidth
              margin="normal"
              id="outlined-name"
              name="name"
              label={t("ESD_TEST.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              value={station.name}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {!isEditing && <LockOutlined />}
                  </InputAdornment>
                ),
              }}
            />
          </Typography>
          <Box className="button-container">
            {isEditing ? (
              // Se isEditing for true, exibe o botão de salvar
              <Button
                type="submit" // Botão muda para submit no modo de edição
                variant="contained"
                color="success"
                onClick={handleSubmit} // Submete o formulário
                className="custom-button custom-font-edit"
              >
                {t("LINE.DIALOG.SAVE", { appName: "App for Translations" })}
              </Button>
            ) : (
              // Se isEditing for false, exibe o botão de editar
              <Button
                variant="contained"
                color="success"
                onClick={handleEditClick} // Habilita o modo de edição
                className="custom-button custom-font-edit"
              >
                {t("LINE.DIALOG.EDIT_LINE", {
                  appName: "App for Translations",
                })}
              </Button>
            )}

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

export default LineModal;
