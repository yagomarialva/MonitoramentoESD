using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILogMonitorEsdRepository
    {

        Task<List<LogMonitorEsdModel>> GetAllAsync();
        Task<LogMonitorEsdModel?> GetByIdAsync(int id);
        Task<LogMonitorEsdModel?> GetMessageTypeAsync(string messageType);
        Task<LogMonitorEsdModel?> GetMessageContentAsync(string messageContent);
        Task<List<LogMonitorEsdModel>> GetListMonitorEsdByIdAsync(int monitorId, int page, int pageSize);
        Task<List<LogMonitorEsdModel>> GetMonitorEsdBySerialNumberWithLimitAsync(string serialNumber, int limit);
        Task<LogMonitorEsdModel?> GetMonitorEsdByIdAsync(int id);
        Task<LogMonitorEsdModel?> GetMonitorEsdByIPAsync(string ip);
        Task<LogMonitorEsdModel?> GetMonitorEsdBySnAsync(string sreialNumber);
        Task<LogMonitorEsdModel?> ChangeLogAsync(int id, int changeStatus, string? description);
        Task<LogMonitorEsdModel?> AddOrUpdateAsync(LogMonitorEsdModel model);
        Task<LogMonitorEsdModel?> AddSocketyLogAsync(LogMonitorEsdModel model);
        Task<LogMonitorEsdModel?> DeleteAsync(int id);
        Task<LogMonitorEsdModel?> DeleteMonitorEsdByLogIdAsync(int id);



    }
}
