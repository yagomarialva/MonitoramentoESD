using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IPositionRepository
    {
        Task<List<PositionModel>> GetAllPositions();
        Task<PositionModel?> GetPositionId(int id);
        Task<PositionModel?> GetSizeX(int sizeX);
        Task<PositionModel?> GetSizeY(int sizeY);
        Task<PositionModel?> Include(PositionModel positionModel);
        Task<PositionModel?> Delete(int id);
    }
}
