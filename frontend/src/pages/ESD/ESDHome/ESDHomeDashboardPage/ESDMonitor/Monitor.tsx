import React from "react";
import { Table, Divider, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import './Monitor.css'

interface MonitorsEsd {
  id: number;
  serialNumber: string;
  description: string;
  statusJig: string;
  statusOperador: string;
}

interface MonitorProps {
  monitor: {
    positionSequence: number;
    monitorsEsd: MonitorsEsd;
  };
}

// Define a estrutura dos dados para a tabela
interface DataType {
  key: string;
  serialNumber: string;
  description: string;
  statusJig: string;
  statusOperador: string;
}

const Monitor: React.FC<MonitorProps> = ({ monitor }) => {
  console.log('monitor', monitor)
  // Definição das colunas
  const columns: ColumnsType<DataType> = [
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status Jig",
      dataIndex: "statusJig",
      key: "statusJig",
    },
    {
      title: "Status Operador",
      dataIndex: "statusOperador",
      key: "statusOperador",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataType) => (
        <span>
          <a>Details</a>
          <Divider type="vertical" />
          <a>Delete</a>
        </span>
      ),
    },
  ];

  // Adiciona os dados do monitor ao dataSource
  const data: DataType[] = [
    {
      key: monitor.monitorsEsd.id.toString(),
      serialNumber: monitor.monitorsEsd.serialNumber,
      description: monitor.monitorsEsd.description,
      statusJig: monitor.monitorsEsd.statusJig,
      statusOperador: monitor.monitorsEsd.statusOperador,
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default Monitor;
