using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILineProductionRepository
    {
        Task<List<LineProductionModel>> GetAllLines();
        Task<LineProductionModel> GetByLineId(int id);
        Task<LineProductionModel> GetByProduceActId(int id);
        Task<LineProductionModel?> Include(LineProductionModel lineModel);
        Task<LineProductionModel> Delete(int id);
    }
}
