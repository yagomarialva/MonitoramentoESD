using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IBraceletAttributeRepository
    {
        Task<List<BraceletAttributeModel>> GetAllBraceletsAtt();
        Task<BraceletAttributeModel> GetByAttribId(int id);
        Task<BraceletAttributeModel> GetByBraceletId(int braceletId);
        Task<BraceletAttributeModel?> GetByPropertyName(string propertyName);
        Task<BraceletAttributeModel> Include(BraceletAttributeModel braceletAtt);
        Task<BraceletAttributeModel> Update(BraceletAttributeModel bracelet, int id);
        Task<BraceletAttributeModel> Delete(int id);
    }
}
