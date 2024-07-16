using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IJigRepository
    {
        Task<List<JigModel>> GetAllJig();
        Task<JigModel> GetByJigId(int id);
        Task<JigModel?> Include(JigModel station);
        Task<JigModel> Delete(int id);
    }
}
