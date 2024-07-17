using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IStationRepository
    {
        Task<List<StationModel>> GetAllStation();
        Task<StationModel> GetByStationId(int id);
        
        Task<StationModel?> Include(StationModel lineModel);
        Task<StationModel> Delete(int id);
    }
}
