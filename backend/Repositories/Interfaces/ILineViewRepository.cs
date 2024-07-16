using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILineViewRepository
    {
        Task<List<LineViewModel>> GetAllLineView();
        Task<LineViewModel> GetByLineViewId(int id);
        Task<LineViewModel> GetByLineProductionId(int id);
        Task<LineViewModel> GetByJigId(int id);
        Task<LineViewModel?> Include(LineViewModel lineViewModel);
        Task<LineViewModel> Delete(int id);
    }
}
