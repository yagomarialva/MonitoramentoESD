import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Alert, Spin } from 'antd';
import { CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import signalRService from '../../../../api/signalRService'; // Ajuste o caminho de importação conforme necessário

interface LogData {
  serialNumber: string;
  status: number;
  description: string;
  messageType: string;
  timestamp: string;
}

export default function RealTimeLogTable() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const connectToSignalR = async () => {
      try {
        await signalRService.startConnection();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setError('Falha ao conectar ao SignalR');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    connectToSignalR();

    signalRService.onReceiveAlert((log: LogData) => {
      setLogs((prevLogs) => [log, ...prevLogs].slice(0, 100)); // Mantém os 100 logs mais recentes
    });

    return () => {
      signalRService.stopConnection();
    };
  }, []);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <InfoCircleOutlined />;
      case 1:
        return <CheckCircleOutlined />;
      case 2:
        return <WarningOutlined />;
      case 3:
        return <CloseCircleOutlined />;
      default:
        return <Badge status="processing" text="Unknown" />;
    }
  };

  const columns = [
    {
      title: 'messageType',
      dataIndex: 'messageType',
      key: 'messageType',
    },
    {
      title: 'Serial Number',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => getStatusBadge(status),
    },
  ];

  // Filtrando os logs para exibir apenas aqueles com status igual a 0
  const filteredLogs = logs.filter(log => log.status === 1);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      
      title={
        <div  >
          <span>Real-time Logs</span>
          <Badge
            status={isConnected ? 'success' : 'error'}
            text={isConnected ? 'Connected' : 'Disconnected'}
          />
        </div>
      }
      style={{
        maxWidth: "100%",
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      <Table
                     
        columns={columns}
        dataSource={filteredLogs} // Passando apenas os logs filtrados
        rowKey={(record, index) => index!.toString()}
        pagination={false}
        scroll={{ y: 600 }}
      />
    </Card>
  );
}
