using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IStationViewRepository
    {
        Task<List<StationViewModel>> GetAllStationView();
        Task<StationViewModel?> GetByStationViewId(Guid id);
        Task<StationViewModel?> GetByPositionSeguenceId(Guid id);
        Task<StationViewModel?> Include(StationViewModel stationViewModel);
        Task<StationViewModel> Delete(Guid id);
    }
}
