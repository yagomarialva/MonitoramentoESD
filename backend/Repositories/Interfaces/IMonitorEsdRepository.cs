using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IMonitorEsdRepository
    {
        Task<List<MonitorEsdModel>> GetAllMonitor();
        Task<MonitorEsdModel?> GetByMonitorId(int id);
        Task<MonitorEsdModel?> GetByMonitorSerial(string serial);
        Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel);
        Task<MonitorEsdModel> Delete(int id);
    }
}
