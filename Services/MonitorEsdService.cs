using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class MonitorEsdService
    {
        private IMonitorEsdRepository repository;
        public MonitorEsdService(IMonitorEsdRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<MonitorEsdModel>> GetAllMonitorEsds()
        {
            return await repository.GetAllMonitor();
        }
        public async Task<MonitorEsdModel?> GetMonitorId(int id)
        {
            return await repository.GetByMonitorId(id);
        }
       
        public async Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel)
        {
            return await repository.Inclue(monitorModel);
        }
        public async Task<MonitorEsdModel?> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }
}
