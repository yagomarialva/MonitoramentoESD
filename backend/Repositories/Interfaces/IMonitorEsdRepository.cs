using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IMonitorEsdRepository
    {
        Task<List<MonitorEsdModel>> GetAllMonitor();
        Task<MonitorEsdModel?> GetByMonitorId(int id);
        Task<MonitorEsdModel?> GetByMonitorSerial(string serial);
        Task<MonitorEsdModel?> GetStatusOperator(string statusOperador);
        Task<MonitorEsdModel?> GetStatusJig(string statusJig);
        Task<MonitorEsdModel?> GetStatus(string status);
        Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel);
        Task<MonitorEsdModel> Delete(int id);
    }
}
