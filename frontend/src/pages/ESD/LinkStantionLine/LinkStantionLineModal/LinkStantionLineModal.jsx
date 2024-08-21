import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Tooltip,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450, // Ajuste a largura do modal conforme necessário
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const LinkStantionLineModal = ({ open, handleClose, link }) => {
  const { t } = useTranslation();

  if (!link) {
    return null; // Retorna null se link for null ou undefined
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper sx={modalStyle}>
        <Tooltip title={link.lineID || ""} arrow>
          <Typography
            variant="h6"
            id="modal-title"
            gutterBottom
            className="ellipsis-text"
            sx={{ width: "100%", overflow: "hidden" }}
          >
            Ligação: {link.lineID} {link.stationID}
          </Typography>
        </Tooltip>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" className="modal-textfield">
            <TextField
              fullWidth
              disabled
              required
              label={t("LINK_STATION_LINE.TABLE.LINE", {
                appName: "App for Translations",
              })}
              defaultValue={link.lineID || ""}
              margin="normal"
            />
            <TextField
              fullWidth
              disabled
              required
              label={t("LINK_STATION_LINE.TABLE.STATION", {
                appName: "App for Translations",
              })}
              defaultValue={link.stationID || ""}
              margin="normal"
            />
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="success" onClick={handleClose}>
            {t("ESD_TEST.DIALOG.CLOSE")}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default LinkStantionLineModal;
