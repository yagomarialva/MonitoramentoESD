import React, { useState, useEffect } from "react";
import { Table, Card, Badge, Alert, Spin, Tooltip, DatePicker } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import signalRService from "../../../../api/signalRService";
import * as XLSX from "xlsx"; // Para exportação para Excel

interface LogData {
  serialNumberEsp: any;
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
  const [dateRange, setDateRange] = useState<[string | null, string | null]>([
    null,
    null,
  ]);

  // Carregar logs do localStorage ao iniciar
  useEffect(() => {
    const savedLogs = localStorage.getItem("logs");
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

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
      const updatedLog = ![0, 1].includes(log.status)
        ? {
            ...log,
            status: -1,
            description: "Monitor desconectado",
            lastUpdated: new Date().toISOString(),
          }
        : log;

      setLogs((prevLogs) => {
        const newLogs = [updatedLog, ...prevLogs].slice(0, 100);

        // Salvar logs no localStorage para persistência
        localStorage.setItem("logs", JSON.stringify(newLogs));

        return newLogs;
      });
    });

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const columns = [
    {
      title: "Data",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      render: (lastUpdated: string) => (
        <Tooltip title={new Date(lastUpdated).toLocaleString()}>
          <span>{new Date(lastUpdated).toLocaleString()}</span>
        </Tooltip>
      ),
      sorter: (a: LogData, b: LogData) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
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
      render: (status: number) => (
        <Tooltip title={status === 1 ? "Conectado" : "Desconectado"}>
          <span>{status === 1 ? <CheckCircleOutlined style={{ color: "green" }} /> : <CloseCircleOutlined style={{ color: "red" }} />}</span>
        </Tooltip>
      ),
      sorter: (a: LogData, b: LogData) => a.status - b.status,
    },
  ];

  const filteredLogs = logs.filter((log) => {
    const withinDateRange =
      dateRange[0] && dateRange[1]
        ? new Date(log.lastUpdated) >= new Date(dateRange[0]) &&
          new Date(log.lastUpdated) <= new Date(dateRange[1])
        : true;

    return (
      (serialNumberFilter ? log.serialNumberEsp.includes(serialNumberFilter) : true) &&
      (statusFilter !== undefined ? log.status === statusFilter : true) &&
      withinDateRange
    );
  });

  const handleDateFilter = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      setDateRange([
        start ? start.startOf("day").toISOString() : null,
        end ? end.endOf("day").toISOString() : null,
      ]);
    } else {
      setDateRange([null, null]);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card title="Logs" className="card-container">
      <div className="table-controls">
        <DatePicker.RangePicker onChange={handleDateFilter} format="DD/MM/YYYY" style={{ marginRight: "10px" }} />
      </div>
      {error && <Alert message="Error" description={error} type="error" showIcon className="error-alert" />}
      <Table
        columns={columns}
        dataSource={filteredLogs}
        rowKey={(record, index) => index!.toString()}
        pagination={{ pageSize: 5, showSizeChanger: false }}
      />
    </Card>
  );
}
