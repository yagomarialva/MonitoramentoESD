using BiometricFaceApi.Hubs;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BiometricFaceApi.Services
{
    public class LogMonitorEsdService
    {
        private readonly ILogMonitorEsdRepository _logMonitorEsd;
        private readonly IHubContext<CommunicationHub> _hubContext;
        public LogMonitorEsdService(ILogMonitorEsdRepository logMonitorEsdRepository, IHubContext<CommunicationHub> hubContext)
        {
            _logMonitorEsd = logMonitorEsdRepository;
            _hubContext = hubContext;
        }
        public async Task<(object?, int)> GetAllAsync()
        {
            try
            {
                var logmonitorEsd = await _logMonitorEsd.GetAllAsync();
                if (!logmonitorEsd.Any())
                {
                    return ("Nenhum Log cadastrado", StatusCodes.Status404NotFound);
                }
                return (logmonitorEsd, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {

                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetByIdAsync(int id)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetByIdAsync(id);
                if (logMonitor == null)
                {
                    return ($"Log de Monitor com Id: {id} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetMonitorEsdByIdAsync(int id)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetMonitorEsdByIdAsync(id);
                if (logMonitor == null)
                {
                    return ($"Monitor Esd com Id: {id} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetMonitorEsdBySnAsync(string sn)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetMonitorEsdBySnAsync(sn);
                if (logMonitor == null)
                {
                    return ($"Monitor Esd com Serial Number: {sn} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetMonitorEsdByIPAsync(string ip)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetMonitorEsdByIPAsync(ip);
                if (logMonitor == null)
                {
                    return ($"Monitor Esd com IP: {ip} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetListMonitorEsdByIdAsync (int id, int page, int pageSize)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetListMonitorEsdByIdAsync(id, page, pageSize);
                if (logMonitor.Count() == 0 )
                {
                    return ($"Monitor Esd com Id: {id} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetLogIncreAsync(string serialNumber, int limit)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetLogIncreasingAsync(serialNumber, limit);
                if (logMonitor.Count() == 0)
                {
                    return ($"Monitor Esd com {serialNumber} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetLogDecreAsync(string serialNumber, int limit)
        {
            try
            {
                var logMonitor = await _logMonitorEsd.GetLogDecreasing(serialNumber, limit);
                if (logMonitor.Count() == 0)
                {
                    return ($"Monitor Esd com {serialNumber} não encontrado.", StatusCodes.Status404NotFound);
                }

                return (logMonitor, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {
                return (exception.Message, StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> GetMessageContentAsync(string messageContent)
        {
            try
            {
                var content = await _logMonitorEsd.GetMessageTypeAsync(messageContent);
                if (content == null)
                {
                    return ($"Conteudo da Mensagem: {messageContent} não encontrado.", StatusCodes.Status404NotFound);
                }
                return (content, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {

                return (exception.Message, StatusCodes.Status400BadRequest); ;
            }
        }
        public async Task<(object?, int)> GetMessageTypeAsync(string messageType)
        {
            try
            {
                var type = await _logMonitorEsd.GetMessageTypeAsync(messageType);
                if (type == null)
                {
                    return ($"Tipo de Mensagem: {messageType} não encontrado.", StatusCodes.Status404NotFound);
                }
                return (type, StatusCodes.Status200OK);
            }
            catch (Exception exception)
            {

                return (exception.Message, StatusCodes.Status400BadRequest); ;
            }
        }
        public async Task<(object?, int)> ChangeStatusLog(int id, bool changeLog, string? description)
        {
            try
            {
                if (string.IsNullOrEmpty(description))
                {
                    throw new ArgumentNullException("Por favor informar o motivo da alteração de status");
                }

                var logMonitor = await _logMonitorEsd.GetByIdAsync(id);

                var changeContent = logMonitor.MessageContent = "Status alterado manualmente após Manutenção.";

                if (logMonitor == null)
                {
                    return ("Log não encontrado", StatusCodes.Status404NotFound);
                }
                var logMonitorModel = new LogMonitorEsdModel
                {
                    ID = id,
                    SerialNumber = logMonitor.SerialNumber,
                    MonitorEsdId = logMonitor.MonitorEsdId,
                    IP = logMonitor.IP,
                    Status = changeLog ? 1 : 0,
                    MessageType = logMonitor.MessageType,
                    MessageContent = changeContent,
                    Description = description
                };
                await _logMonitorEsd.AddOrUpdateAsync(logMonitorModel);
                await _hubContext.Clients.All.SendAsync("ReceiveAlert", logMonitor);
                var updateLog = await _logMonitorEsd.ChangeLogAsync(id, changeLog ? 1 : 0, description);
                return (logMonitorModel, StatusCodes.Status200OK);
            }
            catch (Exception exeception)
            {

                return (exeception.Message, StatusCodes.Status409Conflict);
            }
        }
        public async Task<(object?, int)> AddOrUpdateAsync(LogMonitorEsdModel logMonitorModel)
        {
            try
            {
                LogMonitorEsdModel? existingLogMonitor = await _logMonitorEsd.GetByIdAsync(logMonitorModel.ID);
                bool isNew = existingLogMonitor == null;

                var response = await _logMonitorEsd.AddOrUpdateAsync(logMonitorModel);
                await _hubContext.Clients.All.SendAsync("ReceiveAlert", logMonitorModel);
                int statusCode = isNew ? StatusCodes.Status201Created : StatusCodes.Status200OK;

                return (response, statusCode);
            }
            catch (Exception)
            {
                return ("Verifique se os dados estão corretos.", StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> Delete(int id)
        {
            try
            {
                var log = await _logMonitorEsd.GetByIdAsync(id);
                if (log == null)
                {
                    return ($"{id} não encontrado.", StatusCodes.Status404NotFound);
                }

                await _logMonitorEsd.DeleteAsync(log.ID);

                var content = new
                {
                    id = log.ID,
                    message_Type = log.MessageType,
                    message_Content = log.MessageContent,
                    monitorEsdId = log.MonitorEsdId,
                };

                return (content, StatusCodes.Status200OK);
            }
            catch (Exception)
            {
                return ($"{id} não encontrado.", StatusCodes.Status400BadRequest);
            }
        }
    }
}
