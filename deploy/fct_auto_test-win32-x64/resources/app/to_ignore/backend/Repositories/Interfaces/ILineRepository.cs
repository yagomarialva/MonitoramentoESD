using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILineRepository
    {
        Task<List<LineModel>> GetAllLine();
        Task<LineModel> GetLineID(int id);
        Task<LineModel?> GetLineName(string lineName);
        Task<LineModel?> Include(LineModel lineModel);
        Task<LineModel?> Delete(int id);
    }
}
