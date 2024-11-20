import React, { useEffect, useState, useCallback, useRef } from "react";
import { Image } from "antd";
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
  Avatar,
} from "antd";
import {
  CameraOutlined,
  DeleteFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Webcam from "react-webcam";

const { Content } = Layout;
const { Title } = Typography;

interface Operator {
  id: number;
  name: string;
  badge: string;
  photo?: any;
  stream?: string | Blob | null | any;
}

const OperatorTable: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
  const [isFacialRecognitionModalVisible, setIsFacialRecognitionModalVisible] =
    useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [form] = Form.useForm();
  const webcamRef = useRef<Webcam>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [operatorToDelete, setOperatorToDelete] = useState<number | null>(null);
  const [capturedImageIcon, setCapturedImageIcon] = useState<string | null>(
    null
  );
  const [imageData, setImageData] = useState(null);

  const videoConstraints = {
    width: 480,
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
      if (Array.isArray(result)) {
        setOperators(result);
      } else if (
        result &&
        typeof result === "object" &&
        Array.isArray(result.users)
      ) {
        setOperators(result.users);
      } else {
        console.error("Unexpected API response format:", result);
        setOperators([]);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching operators:", error);
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem("token");
        navigate("/");
      }
      showSnackbar(t(error.message), "error");
      setLoading(false);
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

      if (capturedImage) {
        // Convert the base64 image to a Blob
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        values.stream = blob;
      }
      values.photo = capturedImage; // Armazena a imagem base64 diretamente
      await createOperators(values);
      await fetchOperators();
      showSnackbar(
        t("ESD_OPERATOR.TOAST.CREATE_SUCCESS", {
          appName: "App for Translations",
        })
      );
      setIsModalVisible(false);
      form.resetFields();
      setCapturedImage(null);
    } catch (error: any) {
      console.error("Error creating operator:", error);
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
      if (capturedImage) {
        values.stream = capturedImage;
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
      setCapturedImage(null);
    } catch (error: any) {
      showSnackbar(error.response.data.errors.Name, "error");
    }
  };

  const handleDelete = async () => {
    if (operatorToDelete) {
      try {
        const result = await deleteOperators(operatorToDelete);
        console.log("Delete operator result:", result);
        setOperators(
          operators.filter((operator) => operator.id !== operatorToDelete)
        );
        showSnackbar(
          t("ESD_OPERATOR.TOAST.DELETE_SUCCESS", {
            appName: "App for Translations",
          })
        );
      } catch (error: any) {
        console.error("Error deleting operator:", error);
        showSnackbar(
          error.response?.data || "Error deleting operator",
          "error"
        );
      }
      setIsDeleteModalVisible(false);
      setOperatorToDelete(null);
    }
  };

  const showDeleteConfirmation = (id: number) => {
    setOperatorToDelete(id);
    setIsDeleteModalVisible(true);
  };

  // capturedImage

  const columns: ColumnsType<Operator> = [
    {
      title: t("ESD_OPERATOR.TABLE.PHOTO"),
      dataIndex: "photo",
      key: "photo",
      render: (text, record) => {
        let imageSrc = record.stream;

        // Verifica se o stream é uma string, e tenta convertê-la para base64
        if (typeof imageSrc === "string") {
          try {
            // Decodifica a string base64 para verificar se é válida
            atob(imageSrc);
            // Se for base64, aplica o prefixo para data URL
            imageSrc = `data:image/png;base64,${imageSrc}`;
          } catch (error) {
            console.error("Erro ao converter stream para base64:", error);
          }
        } else if (record.stream instanceof Blob) {
          // Caso o stream seja um Blob, converte para URL temporária
          imageSrc = URL.createObjectURL(record.stream);
        }

        // Condição para mostrar a imagem ou um avatar de ícone padrão
        return imageSrc ? (
          <Image
            src={imageSrc}
            width={35}
            height={35}
            style={{ borderRadius: "50%" }} // Adiciona arredondamento
            onLoad={() => {
              // Revoga o URL temporário após o carregamento da imagem
              if (record.stream instanceof Blob) {
                URL.revokeObjectURL(imageSrc);
              }
            }}
          />
        ) : (
          <Avatar icon={<UserOutlined />} />
        );
      },
    },
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
              className="no-border-button-informations"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t("ESD_OPERATOR.DELETE_OPERATOR")}>
            <Button
              className="no-border-button-informations"
              icon={<DeleteOutlined />}
              danger
              onClick={() => showDeleteConfirmation(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    form.setFieldsValue(operator);
    setCapturedImage(operator.photo || null);
    setIsModalVisible(true);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCameraModalVisible(false);
      setCapturedImageIcon(imageSrc);
    }
  }, []);

  const handleFacialRecognition = () => {
    setIsFacialRecognitionModalVisible(true);
  };

  return (
    <Layout className="site-layout">
      <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={2}>
            {t("ESD_OPERATOR.FACIAL_RECOGNITION", {
              appName: "App for Translations",
            })}
          </Title>
          <Space>
            <Button
              style={{ backgroundColor: "#389e0d", borderRadius: "0" }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingOperator(null);
                form.resetFields();
                setCapturedImage(null);
                setIsModalVisible(true);
              }}
            >
              {t("ESD_OPERATOR.ADD_OPERATOR", {
                appName: "App for Translations",
              })}
            </Button>
          </Space>
        </div>
        <Space style={{ marginBottom: 16 }}>
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
          setCapturedImage(null);
        }}
        footer={null}
        style={{ maxHeight: "100px", maxWidth: "300px" }}
      >
        <Form
          form={form}
          onFinish={
            editingOperator ? handleUpdateOperator : handleCreateOperator
          }
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={t("ESD_OPERATOR.TABLE.NAME")}
            rules={[
              { required: true, message: t("ESD_OPERATOR.NAME_REQUIRED") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="badge"
            label={t("ESD_OPERATOR.TABLE.USER_ID")}
            rules={[
              { required: true, message: t("ESD_OPERATOR.BADGE_REQUIRED") },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            {capturedImage ? (
              <div>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ width: "100%", maxWidth: "300px" }}
                />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    onClick={() => setIsCameraModalVisible(true)}
                    icon={<CameraOutlined />}
                    style={{ marginTop: "8px" }}
                  >
                    {t("ESD_OPERATOR.RETAKE_PHOTO")}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                style={{ borderRadius: "0" }}
                onClick={() => setIsCameraModalVisible(true)}
                icon={<CameraOutlined />}
              >
                {t("ESD_OPERATOR.TAKE_PHOTO")}
              </Button>
            )}
          </Form.Item>
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{ backgroundColor: "#389e0d", borderRadius: "0" }}
                type="primary"
                htmlType="submit"
              >
                {editingOperator
                  ? t("ESD_OPERATOR.UPDATE")
                  : t("ESD_OPERATOR.CREATE")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t("ESD_OPERATOR.TAKE_PHOTO")}
        visible={isCameraModalVisible}
        onCancel={() => setIsCameraModalVisible(false)}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ marginBottom: "16px" }}
          />
          <Space>
            <Button
              style={{ borderRadius: "0" }}
              onClick={() => setIsCameraModalVisible(false)}
            >
              {t("ESD_OPERATOR.CANCEL")}
            </Button>
            <Button
              style={{ backgroundColor: "#389e0d", borderRadius: "0" }}
              type="primary"
              onClick={captureImage}
            >
              {t("ESD_OPERATOR.CAPTURE")}
            </Button>
          </Space>
        </div>
      </Modal>
      <Modal
        title={t("ESD_OPERATOR.FACIAL_RECOGNITION")}
        visible={isFacialRecognitionModalVisible}
        onCancel={() => setIsFacialRecognitionModalVisible(false)}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ marginBottom: "16px" }}
          />
          <Space>
            <Button onClick={() => setIsFacialRecognitionModalVisible(false)}>
              {t("ESD_OPERATOR.CANCEL")}
            </Button>
            <Button type="primary" onClick={captureImage}>
              {t("ESD_OPERATOR.CAPTURE")}
            </Button>
          </Space>
        </div>
      </Modal>
      <Modal
        title={
          <span>
            <DeleteFilled style={{ color: "#f5a623", marginRight: "8px" }} />
            {t("ESD_OPERATOR.CONFIRM_DIALOG.DELETE_OPERATOR")}
          </span>
        }
        visible={isDeleteModalVisible}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setOperatorToDelete(null);
        }}
        footer={null}
        width={330}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p>{t("ESD_OPERATOR.CONFIRM_DIALOG.CONFIRM_TEXT")}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              key="cancel"
              onClick={() => {
                setIsDeleteModalVisible(false);
                setOperatorToDelete(null);
              }}
              style={{ marginRight: "8px", borderRadius: "0" }}
            >
              {t("ESD_OPERATOR.CONFIRM_DIALOG.CLOSE")}
            </Button>
            <Button
              key="submit"
              type="primary"
              style={{ backgroundColor: "#389e0d", borderRadius: "0" }}
              onClick={handleDelete}
            >
              {t("ESD_OPERATOR.CONFIRM_DIALOG.SAVE")}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default OperatorTable;
