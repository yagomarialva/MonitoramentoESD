import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { LockOutlined } from "@ant-design/icons";
import InputAdornment from "@mui/material/InputAdornment";
import LineAxisIcon from "@mui/icons-material/LineAxis";
import { updateLine } from "../../../../api/linerApi";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import "./StationModal.css";

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

const StationModal = ({ open, handleClose, onSubmit, station }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false); // Estado de edição inicializado como false
  const [stationESD, setStationESD] = useState({
    name: "",
  });

  useEffect(() => {
    setIsEditing(false);
    if (station) {
      setStationESD(station);
    }
  }, [station]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStationESD((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("here", isEditing);
    e.preventDefault();
    try {
      await onSubmit(stationESD);
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
    <>
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
          <PrecisionManufacturingOutlinedIcon className="user-icon" />
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {/* Outros campos de formulário */}
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              required
              disabled={!isEditing}
              fullWidth
              margin="normal"
              id="outlined-name"
              name="name"
              label={t("ESD_TEST.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              value={stationESD.name}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {!isEditing && <LockOutlined />}
                  </InputAdornment>
                ),
              }}
            />

            {/* Substituindo os TextFields por Select */}
            <FormControl fullWidth margin="normal" disabled={!isEditing}>
              <InputLabel id="sizeX-label">Size X</InputLabel>
              <Select
                labelId="sizeX-label"
                id="sizeX"
                name="sizeX"
                value={stationESD.sizeX}
                onChange={handleChange}
                label="Size X"
                IconComponent={isEditing ? undefined : () => <LockOutlined />}
              >
                {[...Array(6).keys()].map((x) => (
                  <MenuItem key={x + 1} value={x + 1}>
                    {x + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" disabled={!isEditing}>
              <InputLabel id="sizeY-label">Size Y</InputLabel>
              <Select
                labelId="sizeY-label"
                id="sizeY"
                name="sizeY"
                value={stationESD.sizeY}
                onChange={handleChange}
                label="Size Y"
                IconComponent={isEditing ? undefined : () => <LockOutlined />}
              >
                {[...Array(6).keys()].map((y) => (
                  <MenuItem key={y + 1} value={y + 1}>
                    {y + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Typography>
          {/* Botões de ação */}
          <Box className="button-container">
            {isEditing ? (
              <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={handleSubmit}
                className="custom-button custom-font-edit"
              >
                {t("LINE.DIALOG.SAVE", { appName: "App for Translations" })}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleEditClick}
                className="custom-button custom-font-edit"
              >
                {t("LINE.DIALOG.EDIT_LINE", { appName: "App for Translations" })}
              </Button>
            )}

            <Button
              type="button"
              variant="outlined"
              color="success"
              onClick={handleClose}
              className="custom-button custom-font"
            >
              {t("LINE.DIALOG.CLOSE", { appName: "App for Translations" })}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
      {/* <Modal
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
          <PrecisionManufacturingOutlinedIcon className="user-icon" />
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={station.name}
              margin="normal"
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={station.sizeX}
              margin="normal"
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_TEST.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={station.sizeY}
              margin="normal"
            />
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={handleClose}>
            {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
          </Button>
        </Box>
      </Paper>
    </Modal> */}
    </>
  );
};

export default StationModal;
