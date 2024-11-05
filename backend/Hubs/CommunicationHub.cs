using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;

namespace BiometricFaceApi.Hubs
{
    public class CommunicationHub : Hub
    {
        private readonly ILogMonitorEsdRepository _logMonitorEsd;
        private readonly ILogger<CommunicationHub> _logger;
        private static Queue<LogMonitorEsdModel> _logQueue = new Queue<LogMonitorEsdModel>();
        private static bool _serverIsOnline = false;

        public CommunicationHub(IMonitorEsdRepository monitorEsdRepository, ILogMonitorEsdRepository logMonitorEsdRepository, ILogger<CommunicationHub> logger)
        {
            _logMonitorEsd = logMonitorEsdRepository;
            _logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"Cliente conectado: {Context.ConnectionId}");

            // Servidor está online novamente
            _serverIsOnline = true;

            // Enviar todos os logs pendentes na fila
            await ProcessQueueLogsAsync();

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation($"Cliente desconectado: {Context.ConnectionId}");

            //Servidor está offline
            _serverIsOnline = false;

            //await base.OnConnectedAsync();

            if (exception != null)
            {
                _logger.LogError($"Erro de desconexão: {exception.Message}");
            }
            await base.OnDisconnectedAsync(exception);
        }

        // Envia mensagem para um cliente específico
        public async Task SendMessageToUser(string connectionId, string message)
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }

        // Recebe logs de um monitor ESD
        public async Task ReceiveLogFromMonitor(string logData)
        {
            try
            {
                var logObject = DeserializeLogData(logData);
                if (logObject != null)
                {
                    if (_serverIsOnline)
                    {
                        // Armazena o log no banco e transmite ao front-end
                        await SaveLogData(logObject);
                        await Clients.All.SendAsync("ReceiveLog", logObject);
                    }
                    else
                    {
                        // Se o servidor estiver offline, adicionar o log na fila
                        _logQueue.Enqueue(logObject);
                        _logger.LogInformation("Servidor offline. Log armazenado na fila.");
                    }
                }
                else
                {
                    // Enviar status 400 ao cliente (via mensagem customizada)
                    await Clients.Caller.SendAsync("ReceiveLogError", "400 Bad Request: Dados inválidos!");
                }
            }
            catch (JsonException ex)
            {
                _logger.LogError($"Erro ao deserializar logData: {ex.Message}", ex);
                await Clients.Caller.SendAsync("ReceiveLogError", "400 Bad Request: Erro ao processar os dados recebidos.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao salvar os dados: {ex.Message}", ex);
                await Clients.Caller.SendAsync("ReceiveLogError", "Erro ao salvar os dados no servidor.");
            }
        }

        private LogMonitorEsdModel? DeserializeLogData(string logData)
        {
            try
            {
                return JsonConvert.DeserializeObject<LogMonitorEsdModel>(logData);
            }
            catch (JsonException ex)
            {
                _logger.LogError($"Erro ao deserializar JSON: {ex.Message}", ex);
                return null;
            }
        }

        private async Task SaveLogData(LogMonitorEsdModel logObject)
        {
            await _logMonitorEsd.AddSocketyLogAsync(logObject);
        }

        private async Task ProcessQueueLogsAsync()
        {
            while (_logQueue.Count > 0)
            {
                var log = _logQueue.Dequeue();
                await SaveLogData(log);
                await Clients.All.SendAsync("ReceiveLog", log);
            }

        }
    }
}
