using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IBraceletRepository
    {
        Task<List<BraceletModel>> GetAllBracelets();
        Task<BraceletModel> GetByBraceletId(int id);
        Task<BraceletModel?> GetByBreceletSn(string sn);
        Task<BraceletModel?> Include(BraceletModel bracelet);
        Task<BraceletModel> Delete(int id);
    }
}
