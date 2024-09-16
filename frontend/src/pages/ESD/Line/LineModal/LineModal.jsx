// import React from 'react';
// import { Modal, Input, Button, Typography, Space, Card } from 'antd';
// import { LockOutlined } from '@ant-design/icons';
// import LineAxisIcon from "@mui/icons-material/LineAxis";
// import './LineModal.css'; // Certifique-se de importar o CSS

// const LineModal = ({ open, handleClose, line, handleEdit }) => {
//   return (
//     <Modal
//       open={open}
//       onCancel={handleClose}
//       footer={null} // Removendo os botões padrão do modal
//       className="custom-modal" // Adicionando uma classe CSS personalizada
//     >
//       <Card>
// <div className="modal-header">
//   <Typography.Title level={4}><LineAxisIcon className="axis-icon"/></Typography.Title>
// </div>
// <div className="modal-form">
//   <Input
//     placeholder="Enter value"
//     disabled
//     suffix={<LockOutlined />}
//   />
// </div>
// <div className="modal-buttons">
//   <Button onClick={handleEdit} className="modal-edit-button">
//     Editar
//   </Button>
//   <Button onClick={handleClose} className="modal-close-button">
//     Voltar
//   </Button>
// </div>
//       </Card>
//     </Modal>
//   );
// };

// export default LineModal;
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
import { LockOutlined } from "@ant-design/icons";
import InputAdornment from "@mui/material/InputAdornment";
import LineAxisIcon from "@mui/icons-material/LineAxis";
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

const LineModal = ({ open, handleClose, line }) => {
  const { t } = useTranslation();

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
        <Box component="form" noValidate autoComplete="off">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              required
              label={t("LINE.TABLE.NAME", {
                appName: "App for Translations",
              })}
              defaultValue={line.name}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LockOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </Typography>
        </Box>
        <Box className="button-container">
          <Button
            variant="contained"
            color="success"
            onClick={handleClose}
            className="custom-button custom-font-edit"
          >
            {t("LINE.DIALOG.EDIT_LINE", { appName: "App for Translations" })}
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleClose}
            className="custom-button custom-font"
          >
            {t("LINE.DIALOG.CLOSE", { appName: "App for Translations" })}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default LineModal;
