import React, { useState, useEffect } from "react";
import { Modal, Tooltip, Checkbox, Input } from "antd";
import { EditOutlined, DeleteOutlined, LaptopOutlined } from "@mui/icons-material";
import Monitor from "../ESDHomeDashboardPage/ESDMonitor/Monitor";
import "./ReusableModal.css";

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  title: string;
  monitor: any;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  onEdit,
  onDelete,
  title,
  monitor,
}) => {
  const [isFooterVisible, setFooterVisible] = useState(false);
  const [actionType, setActionType] = useState<"editar" | "excluir" | null>(null);
  const [selectedOperatorFailures, setSelectedOperatorFailures] = useState<string[]>([]);
  const [selectedMonitorFailures, setSelectedMonitorFailures] = useState<string[]>([]);
  const [operatorOtherFailure, setOperatorOtherFailure] = useState<string | null>(null);
  const [monitorOtherFailure, setMonitorOtherFailure] = useState<string | null>(null);
  const [showOperatorInput, setShowOperatorInput] = useState(false);
  const [showMonitorInput, setShowMonitorInput] = useState(false);
  const [isMonitorTabActive, setMonitorTabActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const operatorFailures = [
    "Erro de configuração",
    "Falha na inicialização",
    "Problema de comunicação",
    "Erro de leitura do monitor",
  ];

  const monitorFailures = [
    "Monitor não responde",
    "Erro de calibração",
    "Falha de firmware",
    "Sinal fora da faixa",
  ];

  // Resetar o estado sempre que o modal abrir
  useEffect(() => {
    if (visible) {
      setFooterVisible(false);
      setActionType(null);
      setSelectedOperatorFailures([]);
      setSelectedMonitorFailures([]);
      setShowOperatorInput(false);
      setShowMonitorInput(false);
      setOperatorOtherFailure(null);
      setMonitorOtherFailure(null);
    }
  }, [visible]);

  // Garante que a lista de falhas seja exibida corretamente ao ativar o modo de edição
  useEffect(() => {
    if (isFooterVisible && actionType === "editar") {
      setMonitorTabActive(true);
    }
  }, [isFooterVisible, actionType]);

  const handleFailureSelect = (
    checked: boolean,
    failure: string,
    type: "operator" | "monitor"
  ) => {
    const setter =
      type === "operator" ? setSelectedOperatorFailures : setSelectedMonitorFailures;

    setter((prev) =>
      checked ? [...prev, failure] : prev.filter((item) => item !== failure)
    );

    if (failure === "Outros") {
      if (type === "operator") {
        setShowOperatorInput(checked);
      } else {
        setShowMonitorInput(checked);
      }
    }
  };

  const handleEdit = () => {
    setFooterVisible(true);
    setActionType("editar");
    setIsEditing(true);
  };

  const handleDelete = () => {
    setFooterVisible(true);
    setActionType("excluir");
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false); // Resetando o estado de edição ao fechar o modal
};


  return (
    <Modal
      className="ellipsis-modal"
      title={
        <div className="modal-title-container">
          <div className="title-content">
            <LaptopOutlined style={{ marginRight: "8px", fontSize: "18px" }} />
            <Tooltip title={title}>
              <span className="ellipsis-text">
                {title.length > 5 ? `${title.slice(0, 5)}...` : title}
              </span>
            </Tooltip>
          </div>
          <div className="title-icons">
            <Tooltip title="Editar">
              <EditOutlined className="icon-action" onClick={handleEdit} />
            </Tooltip>
            <Tooltip title="Excluir">
              <DeleteOutlined className="icon-action" onClick={handleDelete} />
            </Tooltip>
          </div>
        </div>
      }
      visible={visible}
      onCancel={handleClose}
      footer={
        isFooterVisible && (
          <div className="modal-footer">
            <button className="modal-button" onClick={onEdit}>
              {actionType === "editar" ? "Salvar" : "Excluir"}
            </button>
            <button className="modal-button" onClick={onDelete}>
              Cancelar
            </button>
          </div>
        )
      }
    >
      <Monitor monitor={monitor} onMonitorTabActive={setMonitorTabActive} isEditing={isEditing} />

      {isFooterVisible && actionType === "editar" && isMonitorTabActive && (
        <div className="failure-lists">
          <h4>Possíveis Falhas do Operador:</h4>
          <ul>
            {operatorFailures.map((failure) => (
              <li key={failure}>
                <Checkbox
                  checked={selectedOperatorFailures.includes(failure)}
                  onChange={(e) =>
                    handleFailureSelect(e.target.checked, failure, "operator")
                  }
                >
                  {failure}
                </Checkbox>
              </li>
            ))}
            <li>
              <Checkbox
                checked={showOperatorInput}
                onChange={(e) => handleFailureSelect(e.target.checked, "Outros", "operator")}
              >
                Outros
              </Checkbox>
              {showOperatorInput && (
                <Input
                  placeholder="Descreva a falha"
                  value={operatorOtherFailure || ""}
                  onChange={(e) => setOperatorOtherFailure(e.target.value)}
                  style={{ width: "70%", marginLeft: "8px" }}
                />
              )}
            </li>
          </ul>

          <h4>Possíveis Falhas do Monitor:</h4>
          <ul>
            {monitorFailures.map((failure) => (
              <li key={failure}>
                <Checkbox
                  checked={selectedMonitorFailures.includes(failure)}
                  onChange={(e) =>
                    handleFailureSelect(e.target.checked, failure, "monitor")
                  }
                >
                  {failure}
                </Checkbox>
              </li>
            ))}
            <li>
              <Checkbox
                checked={showMonitorInput}
                onChange={(e) => handleFailureSelect(e.target.checked, "Outros", "monitor")}
              >
                Outros
              </Checkbox>
              {showMonitorInput && (
                <Input
                  placeholder="Descreva a falha"
                  value={monitorOtherFailure || ""}
                  onChange={(e) => setMonitorOtherFailure(e.target.value)}
                  style={{ width: "70%", marginLeft: "8px" }}
                />
              )}
            </li>
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default ReusableModal;
