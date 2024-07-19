﻿using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IMonitorEsdRepository
    {
        Task<List<MonitorEsdModel>> GetAllMonitor();
        Task<MonitorEsdModel?> GetByMonitorId(int id);
        Task<MonitorEsdModel?> GetUserId(int id);
        Task<MonitorEsdModel?> GetByMonitorSerial(string serial);
        Task<MonitorEsdModel?> GetPositionX(int x);
        Task<MonitorEsdModel?> GetPositionY(int y);
        Task<bool> PositionExistsAsync(int positionX, int positionY);
        Task<MonitorEsdModel?> GetStatus(string status);
        Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel);
        Task<MonitorEsdModel> Delete(int id);
    }
}
