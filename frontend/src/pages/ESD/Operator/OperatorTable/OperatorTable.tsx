import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllOperators,
  createOperators,
  deleteOperators,
  updateOperators,
} from "../../../../api/operatorsAPI";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Space,
  Popconfirm,
  message,
  Tooltip,
  Modal,
  Form,
  Spin,
} from "antd";
import {
  CameraOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { UserOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";

const { Content } = Layout;
const { Title } = Typography;

interface Operator {
  id: number;
  name: string;
  badge: string;
  photo?: string;
}

const OperatorTable: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFacialRecognitionModalVisible, setIsFacialRecognitionModalVisible] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [form] = Form.useForm();
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user",
  };

  const showSnackbar = useCallback(
    (
      content: string,
      type: "success" | "error" | "info" | "warning" = "success"
    ) => {
      message[type](content);
    },
    []
  );

  const fetchOperators = async () => {
    try {
      const result = await getAllOperators();
      setOperators(result.users.value || result.users);
      setLoading(false);
    } catch (error: any) {
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
      showSnackbar(t(error.message), "error");
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [navigate, showSnackbar, t]);

  const handleCreateOperator = async (values: Operator) => {
    try {
      const alreadyExists = operators.some((op) => op.badge === values.badge);

      if (alreadyExists) {
        showSnackbar("Operador já existe no sistema.", "error");
        return;
      }

      if (imageSrc) {
        values.photo = imageSrc;
      }

      await createOperators(values);
      await fetchOperators();
      showSnackbar(
        t("ESD_OPERATOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      setIsModalVisible(false);
      form.resetFields();
      setImageSrc(null);
    } catch (error: any) {
      showSnackbar(
        t("ESD_OPERATOR.TOAST.TOAST_ERROR", {
          appName: "App for Translations",
        }),
        "error"
      );
    }
  };

  const handleUpdateOperator = async (values: Operator) => {
    try {
      if (imageSrc) {
        values.photo = imageSrc;
      }

      await updateOperators(values);
      await fetchOperators();
      showSnackbar(
        t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      setIsModalVisible(false);
      setEditingOperator(null);
      setImageSrc(null);
    } catch (error: any) {
      showSnackbar(error.response.data.errors.Name, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOperators(id);
      setOperators(operators.filter((operator) => operator.id !== id));
      showSnackbar(
        t("ESD_OPERATOR.TOAST.DELETE_SUCCESS", {
          appName: "App for Translations",
        })
      );
    } catch (error: any) {
      showSnackbar(error.response.data, "error");
    }
  };

  const columns: ColumnsType<Operator> = [
    {
      title: t("ESD_OPERATOR.TABLE.NAME", { appName: "App for Translations" }),
      dataIndex: "name",
      key: "name",
      filteredValue: [searchName],
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: t("ESD_OPERATOR.TABLE.USER_ID", {
        appName: "App for Translations",
      }),
      dataIndex: "badge",
      key: "badge",
      filteredValue: [searchBadge],
      onFilter: (value, record) =>
        record.badge.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: t("ESD_OPERATOR.TABLE.ACTIONS"),
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("ESD_OPERATOR.EDIT_OPERATOR")}>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t("ESD_OPERATOR.DELETE_OPERATOR")}>
            <Popconfirm
              title={t("ESD_OPERATOR.CONFIRM_DIALOG.CONFIRM_TEXT")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("ESD_OPERATOR.CONFIRM_DIALOG.SAVE")}
              cancelText={t("ESD_OPERATOR.CONFIRM_DIALOG.CLOSE")}
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    form.setFieldsValue(operator);
    setImageSrc(operator.photo || null);
    setIsModalVisible(true);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImageSrc(imageSrc || null);
  }, []);

  const handleFacialRecognition = () => {
    setIsFacialRecognitionModalVisible(true);
  };

  return (
    <Layout className="site-layout">
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          position: "relative",
        }}
      >
        <Title level={2}>
          {t("ESD_OPERATOR.TABLE_HEADER", { appName: "App for Translations" })}
        </Title>
        <Space style={{ marginBottom: 16, width: "100%" }}>
          <Input
            placeholder={t("ESD_OPERATOR.TABLE.NAME", {
              appName: "App for Translations",
            })}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Input
            placeholder={t("ESD_OPERATOR.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            value={searchBadge}
            onChange={(e) => setSearchBadge(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Space>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingOperator(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            style={{ marginRight: '8px' }}
          >
            {t("ESD_OPERATOR.ADD_OPERATOR", {
              appName: "App for Translations",
            })}
          </Button>
          <Button
            icon={<CameraOutlined />}
            onClick={handleFacialRecognition}
          >
            {t("ESD_OPERATOR.FACIAL_RECOGNITION", { appName: "App for Translations" })}
          </Button>
        </div>
        <Spin spinning={loading}>
          <Table
            dataSource={operators}
            columns={columns}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Spin>
      </Content>
      <Modal
        title={
          editingOperator
            ? t("ESD_OPERATOR.EDIT_OPERATOR")
            : t("ESD_OPERATOR.ADD_OPERATOR")
        }
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setImageSrc(null);
        }}
        footer={null}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          {imageSrc ? (
            <img src={imageSrc} alt="Operator" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            <UserOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
          )}
        </div>

        <Form
          form={form}
          onFinish={editingOperator ? handleUpdateOperator : handleCreateOperator}
          layout="vertical"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="name"
              label={t("ESD_OPERATOR.TABLE.NAME")}
              rules={[
                { required: true, message: t("ESD_OPERATOR.NAME_REQUIRED") },
              ]}
              style={{ flex: 1, marginRight: "16px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="badge"
              label={t("ESD_OPERATOR.TABLE.USER_ID")}
              rules={[
                { required: true, message: t("ESD_OPERATOR.BADGE_REQUIRED") },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingOperator
                ? t("ESD_OPERATOR.DIALOG.SAVE")
                : t("ESD_OPERATOR.DIALOG.CREATE_OPERATOR")}
            </Button>
            <Button onClick={captureImage} icon={<CameraOutlined />} style={{ marginLeft: '8px' }}>
              {t("ESD_OPERATOR.CAPTURE_PHOTO")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t("ESD_OPERATOR.FACIAL_RECOGNITION")}
        visible={isFacialRecognitionModalVisible}
        onCancel={() => setIsFacialRecognitionModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsFacialRecognitionModalVisible(false)}>
            {t("ESD_OPERATOR.CANCEL")}
          </Button>,
          <Button key="capture" type="primary" onClick={captureImage}>
            {t("ESD_OPERATOR.CAPTURE")}
          </Button>,
        ]}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </Modal>
    </Layout>
  );
};

export default OperatorTable;