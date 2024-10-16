import React, { useState, useEffect } from "react";
import { Modal, Typography, Form, Select, Button, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Item: FormItem } = Form;
const { Option } = Select;

interface Monitor {
  id: string;
  description: string;
  serialNumber: string;
  status: string;
  statusOperador: string;
  statusJig: string;
}

interface MonitorEditFormProps {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: Monitor) => Promise<void>;
  initialData?: Monitor;
}

const MonitorEditForm: React.FC<MonitorEditFormProps> = ({
  open,
  handleClose,
  onSubmit,
  initialData,
}) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "pt" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const [monitor, setMonitor] = useState<Monitor>({
    id: "",
    description: "",
    serialNumber: "",
    status: "",
    statusOperador: "",
    statusJig: "",
  });

  useEffect(() => {
    if (initialData) {
      setMonitor(initialData);
    }
  }, [initialData]);

  const handleChange = (name: string, value: string) => {
    setMonitor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (values: Monitor) => {
    try {
      await onSubmit(values);
      handleClose();
    } catch (error) {
      console.error("Error creating or updating monitor:", error);
    }
  };

  return (
    <Modal
      title={t("ESD_MONITOR.DIALOG.EDIT_MONITOR", {
        appName: "App for Translations",
      })}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        initialValues={monitor}
        onFinish={handleSubmit}
      >
        <FormItem
          name="serialNumber"
          label={t("ESD_MONITOR.TABLE.SERIAL_NUMBER", {
            appName: "App for Translations",
          })}
          rules={[{ required: false, message: "Please input the serial number!" }]}
        >
          <Input disabled />
        </FormItem>

        <FormItem
          name="description"
          label={t("ESD_MONITOR.TABLE.DESCRIPTION", {
            appName: "App for Translations",
          })}
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input onChange={(e) => handleChange("description", e.target.value)} />
        </FormItem>

        <FormItem
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select the status!" }]}
        >
          <Select
            onChange={(value) => handleChange("status", value)}
          >
            <Option value="PASS">Pass</Option>
            <Option value="FAIL">Fail</Option>
          </Select>
        </FormItem>

        <FormItem
          name="statusOperador"
          label="Status do Operador"
          rules={[{ required: true, message: "Please select the operator status!" }]}
        >
          <Select
            onChange={(value) => handleChange("statusOperador", value)}
          >
            <Option value="PASS">Pass</Option>
            <Option value="FAIL">Fail</Option>
          </Select>
        </FormItem>

        <FormItem
          name="statusJig"
          label="Status do Jig"
          rules={[{ required: true, message: "Please select the jig status!" }]}
        >
          <Select
            onChange={(value) => handleChange("statusJig", value)}
          >
            <Option value="PASS">Pass</Option>
            <Option value="FAIL">Fail</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="default" onClick={handleClose} style={{ marginRight: "8px" }}>
            {t("ESD_MONITOR.DIALOG.CLOSE", {
              appName: "App for Translations",
            })}
          </Button>
          <Button type="primary" htmlType="submit">
            {t("ESD_MONITOR.DIALOG.SAVE", {
              appName: "App for Translations",
            })}
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default MonitorEditForm;
