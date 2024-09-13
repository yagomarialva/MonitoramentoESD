import React from 'react';
import { Modal, Input, Button, Typography, Space, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import LineAxisIcon from "@mui/icons-material/LineAxis";
import './LineModal.css'; // Certifique-se de importar o CSS

const LineModal = ({ open, handleClose, line, handleEdit }) => {
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null} // Removendo os botões padrão do modal
      className="custom-modal" // Adicionando uma classe CSS personalizada
    >
      <Card>
        <div className="modal-header">
          <Typography.Title level={4}><LineAxisIcon className="axis-icon"/></Typography.Title>
        </div>
        <div className="modal-form">
          <Input
            placeholder="Enter value"
            disabled
            suffix={<LockOutlined />}
          />
        </div>
        <div className="modal-buttons">
          <Button onClick={handleEdit} className="modal-edit-button">
            Editar
          </Button>
          <Button onClick={handleClose} className="modal-close-button">
            Voltar
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default LineModal;
