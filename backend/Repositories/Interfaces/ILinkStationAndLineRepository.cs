using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILinkStationAndLineRepository
    {
        Task<List<LinkStationAndLineModel>> GetAllLinks();
        Task<LinkStationAndLineModel?> GetByLinkId(int id);
        Task<List<LinkStationAndLineModel>?> GetByLineId(int id);
        Task<List<LinkStationAndLineModel>?> GetByStationId(int id);
        Task<LinkStationAndLineModel> GetByLineIdAndStationId(int lineId, int stationID);
        Task<LinkStationAndLineModel?> Include(LinkStationAndLineModel model);
        Task<LinkStationAndLineModel> Delete(int id);
    }
}
