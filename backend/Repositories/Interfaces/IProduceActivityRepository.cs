using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IProduceActivityRepository
    {
        Task<List<ProduceActivityModel>> GetAllProduceActivity();
        Task<ProduceActivityModel?> GetByProduceActivityId(int id);
        Task<ProduceActivityModel?> GetByProduceUserId(int usersProduce);
        Task<ProduceActivityModel?> GetByProduceJigId(int jigProduce);
        Task<ProduceActivityModel?> GetByProduceMonitorId(int monitorProduce);
        Task<ProduceActivityModel?> GetByStationId(int station);
        Task<ProduceActivityModel?> Islocked (int id, bool locked);
        Task<ProduceActivityModel?> Include(ProduceActivityModel produceActivity);
        Task<ProduceActivityModel?> Delete(int id);

    }
}
