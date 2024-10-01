import React, { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Modal,
  TextField,
  Button,
} from "@mui/material";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import { useTranslation } from "react-i18next";
import InputAdornment from "@mui/material/InputAdornment";
import { LockOutlined } from "@ant-design/icons";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import "./StationForm.css";

// Tipagem das props
interface StationFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (station: StationData) => Promise<void>;
}

// Tipagem dos dados da estação
interface StationData {
  id?: number;
  name: string;
  sizeX?: number;
  sizeY?: number;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const StationForm: React.FC<StationFormProps> = ({
  open,
  handleClose,
  onSubmit,
}) => {
  const { t } = useTranslation();

  // Tipagem do estado station
  const [station, setStation] = useState<StationData>({
    name: "",
    sizeX: 6, // Valor padrão para garantir que seja um número
    sizeY: 6, // Valor padrão para garantir que seja um número
  });

  // Função para lidar com mudanças em campos de texto
  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Função para lidar com mudanças em selects
  const handleChangeSelect = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setStation((prev) => ({
      ...prev,
      [name]: Number(value), // Converter o valor para número
    }));
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Verificar se todos os campos obrigatórios estão preenchidos
      if (!station.name || !station.sizeX || !station.sizeY) {
        throw new Error("Todos os campos são obrigatórios.");
      }

      await onSubmit(station);
      handleClose();
    } catch (error:any) {
      console.error("Error creating station:", error);
      // Aqui você pode mostrar uma mensagem de erro para o usuário
      alert("Erro ao criar a estação: " + error.message);
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
      >
        <RouteOutlinedIcon />
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          required
          fullWidth
          margin="normal"
          id="outlined-name"
          name="name"
          label="Name"
          onChange={handleChangeText}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="sizeX">Size X</InputLabel>
          <Select
            labelId="sizeX"
            id="sizeX"
            name="sizeX"
            value={station.sizeX}
            onChange={handleChangeSelect}
            label="Size X"
          >
            {[1, 2, 3, 4, 5, 6].map(value => (
              <MenuItem key={value} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="sizeY">Size Y</InputLabel>
          <Select
            labelId="sizeY"
            id="sizeY"
            name="sizeY"
            value={station.sizeY}
            onChange={handleChangeSelect}
            label="Size Y"
          >
            {[1, 2, 3, 4, 5, 6].map(value => (
              <MenuItem key={value} value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box className="button-container">
          <Button type="submit" variant="contained" color="success">
            Save
          </Button>
          <Button type="button" variant="outlined" color="success" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Paper>
  </Modal>
  );
};

export default StationForm;
