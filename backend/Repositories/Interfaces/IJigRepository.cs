using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IJigRepository
    {
        Task<List<JigModel>> GetAllJig();
        Task<JigModel?> GetByJigId(int jigId);
        Task<JigModel?> GetByName(string jigName);
        Task<JigModel?> GetByPosition(int postionId);
        Task<JigModel?> Include(JigModel station);
        Task<JigModel> Delete(int id);
    }
}
