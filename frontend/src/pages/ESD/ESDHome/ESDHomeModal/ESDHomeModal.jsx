import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
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

const ESDHomeModal = ({ open, handleClose, produce }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper sx={style}>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                disabled
                required
                label="Data"
                defaultValue={"17/04/2024"}
                margin="normal"
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                disabled
                required
                label="Hora"
                defaultValue={"17:45"}
                margin="normal"
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                disabled
                required
                label="Operador"
                defaultValue={"John Doe"}
                margin="normal"
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                disabled
                required
                label="Logs"
                defaultValue={"Lorem ipsum dolor sit amet, consectetur"}
                margin="normal"
              />
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={handleClose}>
            {t("ESD_OPERATOR.DIALOG.CLOSE", {
              appName: "App for Translations",
            })}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ESDHomeModal;
