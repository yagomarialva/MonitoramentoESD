import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";
import { LockOutlined } from "@ant-design/icons";
import "./StationForm.css";

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

const StationForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [station, setStation] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <Typography
          variant="h6"
          id="contained-modal-title-vcenter"
          gutterBottom
          className="user-icon-container"
        >
          <PrecisionManufacturingOutlinedIcon className="user-icon" />
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
                  {<LockOutlined />}
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="sizeX">Size X</InputLabel>
            <Select
              labelId="sizeX"
              id="sizeX"
              name="sizeX"
              value={station.sizeX}
              onChange={handleChange}
              label="sizeX"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="sizeY">Size Y</InputLabel>
            <Select
              labelId="sizeY"
              id="sizeY"
              name="sizeY"
              value={station.sizeY}
              onChange={handleChange}
              label="sizeY"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
            </Select>
          </FormControl>
          <Box className="button-container">
            <Button
              type="submit" // Botão muda para submit no modo de edição
              variant="contained"
              color="success"
              onClick={handleSubmit} // Submete o formulário
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

export default StationForm;
