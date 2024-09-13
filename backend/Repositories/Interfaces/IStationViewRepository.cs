using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IStationViewRepository
    {
        Task<List<StationViewModel>> GetAllStationView();
        Task<StationViewModel?> GetByStationViewId(int id);
        Task<StationViewModel?> GetByPositionSeguenceId(int id);
        Task<StationViewModel?> Include(StationViewModel stationViewModel);
        Task<StationViewModel> Delete(int id);
    }
}
