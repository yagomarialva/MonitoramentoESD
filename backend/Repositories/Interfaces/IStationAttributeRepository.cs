using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IStationAttributeRepository
    {
        Task<List<StationAttributeModel>> GetAllStationAtt();
        Task<StationAttributeModel> GetByAttribId(int id);
        Task<StationAttributeModel> GetByStationId(int stationId);
        Task<StationAttributeModel?> GetByPropertyName(string propertyName);
        Task<StationAttributeModel> Include(StationAttributeModel stationAtt);
        Task<StationAttributeModel> Delete(int id);
    }
}
