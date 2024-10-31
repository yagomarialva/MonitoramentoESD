import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

// Defina a interface para o log
interface LogMonitorEsdModel {
    id: string;
    timestamp: string;
    message: string;
    // Adicione outros campos conforme necessário
}

const LogMonitor: React.FC = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [logs, setLogs] = useState<LogMonitorEsdModel[]>([]);

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://seu-servidor/api/communicationhub') // URL do seu Hub
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                console.log('Conectado ao hub');
                // Se necessário, você pode adicionar chamadas para enviar mensagens ou executar ações após a conexão
            })
            .catch((err) => console.log('Erro ao conectar ao hub:', err));

        newConnection.on('ReceiveLog', (log: LogMonitorEsdModel) => {
            setLogs((prevLogs) => [...prevLogs, log]);
        });

        // Limpeza ao desmontar o componente
        return () => {
            newConnection.stop()
                .then(() => console.log('Desconectado do hub'))
                .catch((err) => console.log('Erro ao desconectar:', err));
        };
    }, []);

    return (
        <div>
            <h2>Logs do Monitor ESD</h2>
            <ul>
                {logs.map((log) => (
                    <li key={log.id}>
                        <strong>{log.timestamp}:</strong> {log.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogMonitor;
