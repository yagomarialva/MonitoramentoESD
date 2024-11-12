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
  Avatar,
} from "antd";
import {
  CameraOutlined,
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
  photo?: string;
  stream?: Blob | null; // Atualizado para aceitar Blob ou null
}

// Função para converter base64 para Blob
function base64ToBlob(base64Data: string, contentType = 'image/png'): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
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
  const [isFacialRecognitionModalVisible, setIsFacialRecognitionModalVisible] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedImageBlob, setCapturedImageBlob] = useState<Blob | null>(null); // Estado para armazenar o Blob
  const [form] = Form.useForm();
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: "user",
  };

  const showSnackbar = useCallback((content: string, type: "success" | "error" | "info" | "warning" = "success") => {
    message[type](content);
  }, []);

  const fetchOperators = async () => {
    try {
      const result = await getAllOperators();
      console.log("API response:", result);
      if (Array.isArray(result)) {
        setOperators(result);
      } else if (result && typeof result === 'object' && Array.isArray(result.users)) {
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
    console.log('capturedImageBlob', capturedImageBlob); // Log para verificar o Blob
    try {
      const alreadyExists = operators.some((op) => op.badge === values.badge);

      if (alreadyExists) {
        showSnackbar("Operador já existe no sistema.", "error");
        return;
      }

      if (capturedImageBlob) {
        values.stream = capturedImageBlob; // Definir o Blob no stream
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
      setCapturedImage(null);
      setCapturedImageBlob(null); // Resetar o Blob após a criação
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
      if (capturedImageBlob) {
        values.stream = capturedImageBlob; // Definir o Blob no stream
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
      setCapturedImageBlob(null); // Resetar o Blob após a atualização
    } catch (error: any) {
      showSnackbar(error.response.data.errors.Name, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteOperators(id);
      console.log("Delete operator result:", result);
      setOperators(operators.filter((operator) => operator.id !== id));
      showSnackbar(t("ESD_OPERATOR.TOAST.DELETE_SUCCESS", { appName: "App for Translations" }));
    } catch (error: any) {
      console.error("Error deleting operator:", error);
      showSnackbar(error.response?.data || "Error deleting operator", "error");
    }
  };

  const columns: ColumnsType<Operator> = [
    {
      title: t("ESD_OPERATOR.TABLE.PHOTO"),
      dataIndex: 'photo',
      key: 'photo',
      render: (photo: string) => (
        <Avatar src={photo} icon={<UserOutlined />} />
      ),
    },
    {
      title: t("ESD_OPERATOR.TABLE.NAME", { appName: "App for Translations" }),
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchName],
      onFilter: (value, record) => record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: t("ESD_OPERATOR.TABLE.USER_ID", { appName: "App for Translations" }),
      dataIndex: 'badge',
      key: 'badge',
      filteredValue: [searchBadge],
      onFilter: (value, record) => record.badge.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: t("ESD_OPERATOR.TABLE.ACTIONS"),
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("ESD_OPERATOR.TABLE.EDIT")}>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title={t("ESD_OPERATOR.TABLE.DELETE")}>
            <Popconfirm
              title={t("ESD_OPERATOR.CONFIRM_DELETE")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("ESD_OPERATOR.YES")}
              cancelText={t("ESD_OPERATOR.NO")}
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
    setCapturedImage(operator.photo || null);
    setIsModalVisible(true);
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      console.log("Captured image source:", imageSrc); // Log para verificar se a imagem foi capturada

      // Extrair a parte base64 da imagem
      const base64Data = imageSrc.split(",")[1];
      
      if (base64Data) {
        // Converter base64 para Blob
        const blob = base64ToBlob(base64Data, 'image/png'); // Garantir o tipo correto
        console.log("Blob criado a partir da imagem capturada:", blob); // Log para verificar o Blob
        
        // Atualizar o estado com o Blob da imagem
        setCapturedImageBlob(blob);
        setCapturedImage(imageSrc); // Opcional: para exibir a imagem capturada
      } else {
        console.error("Erro ao extrair dados base64 da imagem capturada.");
      }
      setIsCameraModalVisible(false);
    } else {
      console.error("Erro ao capturar a imagem. Certifique-se de que o Webcam está funcionando.");
    }
  }, []);

  const handleFacialRecognition = () => {
    setIsFacialRecognitionModalVisible(true);
  };

  return (
    <Layout className="site-layout">
      <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={2}>{t("ESD_OPERATOR.TITLE", { appName: "App for Translations" })}</Title>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setEditingOperator(null);
                form.resetFields();
                setCapturedImage(null);
                setIsModalVisible(true);
              }}
            >
              {t("ESD_OPERATOR.ADD_OPERATOR", { appName: "App for Translations" })}
            </Button>
            <Button
              icon={<CameraOutlined />}
              onClick={handleFacialRecognition}
            >
              {t("ESD_OPERATOR.FACIAL_RECOGNITION", { appName: "App for Translations" })}
            </Button>
          </Space>
        </div>
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder={t("ESD_OPERATOR.TABLE.NAME", { appName: "App for Translations" })}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Input
            placeholder={t("ESD_OPERATOR.TABLE.USER_ID", { appName: "App for Translations" })}
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
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        </Spin>
      </Content>
      <Modal
        title={editingOperator ? t("ESD_OPERATOR.EDIT_OPERATOR") : t("ESD_OPERATOR.ADD_OPERATOR")}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCapturedImage(null);
          setCapturedImageBlob(null); // Resetar o Blob ao fechar o modal
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={editingOperator ? handleUpdateOperator : handleCreateOperator}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label={t("ESD_OPERATOR.TABLE.NAME")}
            rules={[{ required: true, message: t("ESD_OPERATOR.NAME_REQUIRED") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="badge"
            label={t("ESD_OPERATOR.TABLE.USER_ID")}
            rules={[{ required: true, message: t("ESD_OPERATOR.BADGE_REQUIRED") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t("ESD_OPERATOR.PHOTO")}>
            {capturedImage ? (
              <div>
                <img src={capturedImage} alt="Captured" style={{ width: '100%', maxWidth: '300px' }} />
                <Button onClick={() => setIsCameraModalVisible(true)} icon={<CameraOutlined />} style={{ marginTop: '8px' }}>
                  {t("ESD_OPERATOR.RETAKE_PHOTO")}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsCameraModalVisible(true)} icon={<CameraOutlined />}>
                {t("ESD_OPERATOR.TAKE_PHOTO")}
              </Button>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingOperator ? t("ESD_OPERATOR.UPDATE") : t("ESD_OPERATOR.CREATE")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={t("ESD_OPERATOR.TAKE_PHOTO")}
        visible={isCameraModalVisible}
        onCancel={() => setIsCameraModalVisible(false)}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            style={{ marginBottom: '16px' }}
          />
          <Space>
            <Button onClick={() => setIsCameraModalVisible(false)}>
              {t("ESD_OPERATOR.CANCEL")}
            </Button>
            <Button type="primary" onClick={captureImage}>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            style={{ marginBottom: '16px' }}
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
    </Layout>
  );
};

export default OperatorTable;
