using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices.ObjectiveC;

namespace BiometricFaceApi.Services
{
    public class MonitorEsdService
    {
        private IMonitorEsdRepository repository;
        public MonitorEsdService(IMonitorEsdRepository repository)
        {
            this.repository = repository;
        }
        public async Task<ActionResult<List<MonitorEsdModel>>> GetAllMonitorEsds()
        {
            List<MonitorEsdModel> monitor = await repository.GetAllMonitor();
            return (monitor );
        }
        public async Task<MonitorEsdModel?> GetMonitorId(int id)
        {
            return await repository.GetByMonitorId(id);
        }

        public async Task<(object?, int)> Include(MonitorEsdModel monitorModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await repository.Inclue(monitorModel);
            }
            catch (Exception ex)
            {

                response = ex.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (response, statusCode);
        }
        public async Task<(object?, int)> Delete(int id)
        {
            object? content;
            int statusCode;
            try
            {
                var respositoryMonitor = await repository.GetByMonitorId(id);
                if (respositoryMonitor.Id > 0)
                {
                    content = new
                    {
                        id = respositoryMonitor.Id,
                        name = respositoryMonitor.Name,
                        description = respositoryMonitor.Descrition
                    };
                    await repository.Delete(respositoryMonitor.Id);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
                    statusCode = StatusCodes.Status404NotFound;
                }
            }
            catch (Exception ex)
            {

                content = ex.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (content, statusCode);
        }
    }
}
