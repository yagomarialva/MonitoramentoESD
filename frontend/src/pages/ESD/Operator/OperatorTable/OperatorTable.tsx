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
}

const OperatorTable: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [form] = Form.useForm();
  const webcamRef = useRef<Webcam>(null); // Alteração aqui para tipar corretamente

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      setImageSrc(image || null);
      setIsCapturing(false);
    }
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

      await createOperators(values);
      await fetchOperators();
      showSnackbar(
        t("ESD_OPERATOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      setIsModalVisible(false);
      form.resetFields();
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
      await updateOperators(values);
      await fetchOperators();
      showSnackbar(
        t("ESD_OPERATOR.TOAST.UPDATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      setIsModalVisible(false);
      setEditingOperator(null);
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
    setIsModalVisible(true);
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
        {/* Button positioned at the top-right corner */}
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingOperator(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            {t("ESD_OPERATOR.ADD_OPERATOR", {
              appName: "App for Translations",
            })}
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
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <UserOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
        </div>

        <Form
          form={form}
          onFinish={
            editingOperator ? handleUpdateOperator : handleCreateOperator
          }
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
          </Form.Item>
        </Form>
      </Modal>
      {/* <Modal
        title={editingOperator ? "Edit Operator" : "Add Operator"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setImageSrc(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={
            editingOperator ? handleUpdateOperator : handleCreateOperator
          }
        >
          <Form.Item
            name="name"
            label={t("ESD_OPERATOR.TABLE.NAME", {
              appName: "App for Translations",
            })}
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="badge"
            label={t("ESD_OPERATOR.TABLE.USER_ID", {
              appName: "App for Translations",
            })}
            rules={[{ required: true, message: "Please input the badge!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Operator Photo">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                width="100%"
                height="100%"
                screenshotQuality={1}
                onUserMediaError={() => setImageSrc(null)}
              />
              <div>
                {imageSrc && <img src={imageSrc} alt="Captured" />}
                {!isCapturing && (
                  <Button
                    onClick={() => {
                      setIsCapturing(true);
                      captureImage();
                    }}
                    icon={<CameraOutlined />}
                  >
                    Capture
                  </Button>
                )}
              </div>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingOperator ? "Save Changes" : "Add Operator"}
            </Button>
          </Form.Item>
        </Form>
      </Modal> */}
    </Layout>
  );
};

export default OperatorTable;
