import React, { useState, useEffect } from "react";
import { Table, Card, Badge, Alert, Spin, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import signalRService from "../../../../api/signalRService"; // Ajuste o caminho de importação conforme necessário
import './RealTimeLogTable.css'; // Importando o CSS

interface LogData {
  serialNumber: string;
  status: number;
  description: string;
  messageType: string;
  timestamp: string;
  lastUpdated: string;
}

interface RealTimeLogTableProps {
  serialNumberFilter?: string;
  statusFilter?: number;
  tipo?: "jig" | "operador";
}

export default function RealTimeLogTable({
  serialNumberFilter,
  statusFilter,
  tipo,
}: RealTimeLogTableProps) {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connectToSignalR = async () => {
      try {
        await signalRService.startConnection();
        setError(null);
      } catch (err) {
        setError("Falha ao conectar ao SignalR");
      } finally {
        setLoading(false);
      }
    };

    connectToSignalR();

    signalRService.onReceiveAlert((log: LogData) => {
      if (![0, 1].includes(log.status)) {
        const updatedLog = {
          ...log,
          status: -1,
          description: "Monitor desconectado",
          lastUpdated: new Date().toISOString(),
        };
        setLogs((prevLogs) => [updatedLog, ...prevLogs].slice(0, 100));
      } else {
        setLogs((prevLogs) => [log, ...prevLogs].slice(0, 100));
      }
    });

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <CloseCircleOutlined style={{ color: "red" }} />;
      case 1:
        return <CheckCircleOutlined style={{ color: "green" }} />;
      case -1:
        return <WarningOutlined style={{ color: "gray" }} />;
      case 2:
        return <WarningOutlined />;
      case 3:
        return <InfoCircleOutlined />;
      default:
        return <Badge status="processing" text="Unknown" />;
    }
  };

  const getStatusHeaderBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge status="error" style={{ color: "red", marginLeft: "20px" }} />
        );
      case 1:
        return (
          <Badge
            status="success"
            style={{ color: "green", marginLeft: "20px" }}
          />
        );
      case -1:
        return <Badge status="warning" style={{ marginLeft: "20px" }} />;
      default:
        return <Badge status="processing" text="Unknown" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 5,
      render: (lastUpdated: string) => (
        <Tooltip title={formatDate(lastUpdated)}>
          <span>{formatDate(lastUpdated)}</span>
        </Tooltip>
      ),
      sorter: (a: LogData, b: LogData) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: 5,
      render: (description: string) => (
        <Tooltip title={description}>
          <span>{description}</span>
        </Tooltip>
      ),
      sorter: (a: LogData, b: LogData) =>
        a.description.localeCompare(b.description),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 5,
      render: (status: number) => (
        <Tooltip title={status === 1 ? "Sucesso" : "Falha"}>
          <span>{getStatusBadge(status)}</span>
        </Tooltip>
      ),
      sorter: (a: LogData, b: LogData) => a.status - b.status,
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      (serialNumberFilter
        ? log.serialNumber.includes(serialNumberFilter)
        : true) &&
      (statusFilter !== undefined ? log.status === statusFilter : true) &&
      (tipo ? log.messageType === tipo : true)
  );

  const getLastLogStatus = () => {
    const filteredLogsByType = logs.filter((log) => log.messageType === tipo); 
    const lastLog = filteredLogsByType[0];
    if (lastLog) {
      return getStatusHeaderBadge(lastLog.status);
    }
    return <Badge status="processing" style={{ marginLeft: "20px" }} />;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      title={
        <div className="card-title-container">
          <span>{tipo === "operador" ? "Operador" : "Jig"}</span>
          {getLastLogStatus()}
        </div>
      }
      className="card-container"
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="error-alert"
        />
      )}
      <Table
        columns={columns}
        dataSource={filteredLogs}
        rowKey={(record, index) => index!.toString()}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          pageSizeOptions: [],
        }}
        scroll={{ y: 600 }}
      />
    </Card>
  );
}
