using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILinkStationAndLineRepository
    {
        Task<List<LinkStationAndLineModel>> GetAllLinks();
        Task<LinkStationAndLineModel> GetByLinkStationAndLineId(int id);
        Task<LinkStationAndLineModel> GetByLineId(int id);
        Task<LinkStationAndLineModel> GetByStationId(int id);
        Task<LinkStationAndLineModel?> Include(LinkStationAndLineModel model);
        Task<LinkStationAndLineModel> Delete(int id);
    }
}
