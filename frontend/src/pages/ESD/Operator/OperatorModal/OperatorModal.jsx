import React from "react";
import {
  Typography,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import "./OperatorModal.css"; // Importando o arquivo CSS

const OperatorModal = ({ open, handleClose, operator }) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Paper className="modal-paper">
        <Typography
          variant="h6"
          id="contained-modal-title-vcenter"
          className="modal-title"
        >
          {t("ESD_OPERATOR.TABLE.NAME", {
            appName: "App for Translations",
          })}{" "}
          {operator.name}
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" className="modal-textfield">
            <Tooltip
              title={operator.name}
              arrow
            >
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_OPERATOR.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={operator.name}
              margin="normal"
            />
            </Tooltip>
            <Tooltip
              title={operator.badge}
              arrow
            >
            <TextField
              fullWidth
              disabled
              required
              label={t("ESD_OPERATOR.TABLE.USER_ID", {
                appName: "App for Translations",
              })}
              defaultValue={operator.badge}
              margin="normal"
            />
            </Tooltip>
          </Typography>
        </Box>
        <Box className="modal-buttons">
          <Button
            variant="contained"
            color="success"
            className="modal-close-button"
            onClick={handleClose}
          >
            {t("ESD_OPERATOR.DIALOG.CLOSE", {
              appName: "App for Translations",
            })}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default OperatorModal;
