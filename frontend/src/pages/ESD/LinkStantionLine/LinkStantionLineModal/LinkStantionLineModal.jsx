import React, { useEffect } from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Tooltip,
  Box,
  Grid, // Importa o Grid do Material-UI
} from "@mui/material";
import { useTranslation } from "react-i18next";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600, // Ajuste a largura do modal conforme necessário
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const LinkStantionLineModal = ({ open, handleClose, link }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (link) {
      console.log('Link updated in modal:', link);
      // Adicione qualquer lógica adicional aqui, se necessário
    }
  }, [link]); // O useEffect será chamado toda vez que 'link' mudar

  if (!link) {
    return null;  // Não renderiza nada se o link for undefined
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper sx={modalStyle}>
        <Tooltip title={link.serialNumber} arrow>
          <Typography
            variant="h6"
            id="modal-title"
            gutterBottom
            className="ellipsis-text"
            sx={{ width: "100%", overflow: "hidden" }}
          >
            Linha: {link.serialNumber}
          </Typography>
        </Tooltip>
        <Box component="form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                required
                label={t("ESD_TEST.TABLE.USER_ID")}
                defaultValue={link.serialNumber}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                required
                label={t("ESD_TEST.TABLE.NAME")}
                defaultValue={link.description}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                required
                label={t("ESD_MONITOR.STATUS_MONITOR")}
                defaultValue={link.status || "N/A"}  // Ajuste de acordo com seus dados
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t("ESD_MONITOR.CREATED")}
                defaultValue={link.created}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t("ESD_MONITOR.LAST_UPDATED")}
                defaultValue={link.lastUpdated}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t("ESD_MONITOR.ORDER")}
                defaultValue={link.order || "N/A"}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t("ESD_MONITOR.SIZE_X")}
                defaultValue={link.sizeX || "N/A"}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t("ESD_MONITOR.SIZE_Y")}
                defaultValue={link.sizeY || "N/A"}
                margin="normal"
                InputProps={{
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
          </Grid>
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
