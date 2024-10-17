import React, { useState } from "react";
import { Modal, Input, Button, Typography, Select, Form } from "antd";
import { useTranslation } from "react-i18next";
import "./MonitorForm.css"; // Importando o arquivo CSS

const { Option } = Select;

const MonitorForm = ({ open, handleClose, onSubmit }) => {
  const { t } = useTranslation();

  const [monitor, setMonitor] = useState({
    serialNumber: "",
    description: "",
    statusOperador: "",
    statusJig: "",
  });

  const [error, setError] = useState("");
  const [errorName, setErrorName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMonitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setMonitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const nameRegex = /^(?![\s-]+$)[\w-]{1,50}$/;

    if (!nameRegex.test(monitor.serialNumber)) {
      setErrorName(
        "Número inválido. O nome deve conter apenas letras, números, hífens e underscores, e não pode ser composto apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }
    if (!nameRegex.test(monitor.description)) {
      setError(
        "Descrição inválida. A descrição deve conter apenas letras, números, hífens e underscores, e não pode ser composta apenas por espaços ou caracteres especiais. Além disso, deve ter no máximo 50 caracteres."
      );
      return;
    }

    setError("");
    setErrorName("");

    try {
      await onSubmit(monitor);
      handleClose();
    } catch (error) {
      console.error("Error creating monitor:", error);
    }
  };

  const handleCloseModal = () => {
    setError("");
    setErrorName("");
    handleClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCloseModal}
      footer={null}
      title={t("Adicionar Monitor")}
      className="modal-container"
    >
      <Form layout="vertical" onFinish={handleSubmit} className="form-container">
        <Form.Item
          label={t("Número de Série")}
          validateStatus={errorName ? "error" : ""}
          help={errorName}
        >
          <Input
            name="serialNumber"
            value={monitor.serialNumber}
            onChange={handleChange}
            required
          />
        </Form.Item>

        <Form.Item
          label={t("Descrição")}
          validateStatus={error ? "error" : ""}
          help={error}
        >
          <Input
            name="description"
            value={monitor.description}
            onChange={handleChange}
            required
          />
        </Form.Item>
        <div className="button-container">
          <Button onClick={handleClose} danger>
            {t("ESD_TEST.DIALOG.CLOSE", { appName: "App for Translations" })}
          </Button>
          <Button type="primary" htmlType="submit" className="submit-button">
            {t("ESD_TEST.DIALOG.SAVE", { appName: "App for Translations" })}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default MonitorForm;
