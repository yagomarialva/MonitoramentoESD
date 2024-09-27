import React from "react";

interface MonitorProps {
  monitor: {
    positionSequence: number;
    monitorsEsd: {
      id: number;
      serialNumber: string;
      description: string;
      statusJig: string;
      statusOperador: string;
    };
  };
}

const Monitor: React.FC<MonitorProps> = ({ monitor }) => {
  return (
    <div>
      <p><strong>Serial Number:</strong> {monitor.monitorsEsd.serialNumber}</p>
      <p><strong>Description:</strong> {monitor.monitorsEsd.description}</p>
      <p><strong>Status Jig:</strong> {monitor.monitorsEsd.statusJig}</p>
      <p><strong>Status Operator:</strong> {monitor.monitorsEsd.statusOperador}</p>
    </div>
  );
};

export default Monitor;
