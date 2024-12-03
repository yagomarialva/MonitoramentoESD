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
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDeviceId, setVideoDeviceId] = useState<string | undefined>(undefined);

  const videoConstraints: boolean | MediaTrackConstraints = {
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

  const requestCameraAccess = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = { video: true };

      // Check if running in Docker
      if (window.location.hostname === 'localhost' || window.location.hostname.startsWith('172.')) {
        // Use a specific video device if available
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          constraints.video = { deviceId: { exact: videoDevices[0].deviceId } };
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setHasCameraAccess(true);
      setCameraError(null);

      // Store the deviceId
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.deviceId) {
          setVideoDeviceId(settings.deviceId);
        }
      }

      return stream;
    } catch (error: any) {
      console.error("Erro ao acessar a câmera:", error);
      setHasCameraAccess(false);
      if (error.name === "NotReadableError") {
        setCameraError("Não foi possível iniciar a câmera. Verifique se ela não está sendo usada por outro aplicativo.");
      } else if (error.name === "NotAllowedError") {
        setCameraError("Acesso à câmera negado. Por favor, permita o acesso à câmera nas configurações do seu navegador.");
      } else {
        setCameraError(`Erro ao acessar a câmera: ${error.message}`);
      }
      showSnackbar(
        "Não foi possível acessar a câmera. Verifique as permissões e se ela não está sendo usada por outro aplicativo.",
        "error"
      );
      return null;
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchOperators();
  }, [navigate, showSnackbar, t]);

  useEffect(() => {
    if (isCameraModalVisible) {
      requestCameraAccess();
    }
  }, [isCameraModalVisible, requestCameraAccess]);

  const handleCreateOperator = async (values: Operator) => {
    try {
      const alreadyExists = operators.some((op) => op.badge === values.badge);

      if (alreadyExists) {
        showSnackbar("Operador já existe no sistema.", "error");
        return;
      }

      if (capturedImage) {
        const base64Response = await fetch(capturedImage);
        const blob = await base64Response.blob();
        values.stream = blob;
      }
      values.photo = capturedImage;
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

  const columns: ColumnsType<Operator> = [
    {
      title: t("ESD_OPERATOR.TABLE.PHOTO"),
      dataIndex: "photo",
      key: "photo",
      render: (text, record) => {
        let imageSrc = record.stream;

        if (typeof imageSrc === "string") {
          try {
            atob(imageSrc);
            imageSrc = `data:image/png;base64,${imageSrc}`;
          } catch (error) {
            console.error("Erro ao converter stream para base64:", error);
          }
        } else if (record.stream instanceof Blob) {
          imageSrc = URL.createObjectURL(record.stream);
        }

        return imageSrc ? (
          <Image
            src={imageSrc}
            width={35}
            height={35}
            style={{ borderRadius: "50%" }}
            onLoad={() => {
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

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Google Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Apple Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Microsoft Edge";
    } else {
      browserName = "Navegador desconhecido";
    }

    return browserName;
  };

  const isRunningInDocker = useCallback(() => {
    return window.location.hostname === 'localhost' || window.location.hostname.startsWith('172.');
  }, []);

  const handleOpenCameraModal = async () => {
    if (isRunningInDocker()) {
      showSnackbar("Executando em ambiente Docker. Certifique-se de que a câmera está corretamente configurada.", "info");
    }
    const stream = await requestCameraAccess();
    if (stream) {
      setIsCameraModalVisible(true);
    } else {
      const browserName = getBrowserName();
      setCameraError(`Não foi possível acessar a câmera no ${browserName}. Por favor, verifique as configurações de permissão.`);
    }
  };

  const stopWebcam = useCallback(() => {
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    }
    setHasCameraAccess(false);
  }, []);

  const retryRequestCameraAccess = async () => {
    const stream = await requestCameraAccess();
    if (stream) {
      setIsCameraModalVisible(true);
    } else {
      const browserName = getBrowserName();
      setCameraError(`Não foi possível acessar a câmera no ${browserName}. Por favor, verifique as configurações de permissão.`);
    }
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
                    onClick={handleOpenCameraModal}
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
                onClick={handleOpenCameraModal}
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
        onCancel={() => {
          setIsCameraModalVisible(false);
          stopWebcam();
        }}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {hasCameraAccess ? (
            <div>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={
                  hasCameraAccess && videoDeviceId
                    ? { ...videoConstraints, deviceId: { exact: videoDeviceId } }
                    : videoConstraints
                }
                style={{ marginBottom: "16px", width: "457px" }}
              />
            </div>
          ) : (
            <div>
              <p style={{ color: "red", marginBottom: "16px" }}>
                {cameraError || "Solicitando acesso à câmera..."}
              </p>
              <Button onClick={retryRequestCameraAccess}>Tentar novamente</Button>
            </div>
          )}

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
              disabled={!hasCameraAccess}
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

