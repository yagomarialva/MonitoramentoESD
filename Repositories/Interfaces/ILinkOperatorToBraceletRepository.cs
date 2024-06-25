using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface ILinkOperatorToBraceletRepository
    {
        Task<List<LinkOperatorToBraceletModel>> GetAllLinkOperatortToBracelet();
        Task<LinkOperatorToBraceletModel> GetByLinkOperatorToBraceletId(int id);
        Task<LinkOperatorToBraceletModel> GetByLinkOperatorToUserID(int linkUserId);
        Task<LinkOperatorToBraceletModel?> Include(LinkOperatorToBraceletModel linkOperatorModel);
        Task<LinkOperatorToBraceletModel?> Update(LinkOperatorToBraceletModel linkOperatorModel, int id);
        Task<LinkOperatorToBraceletModel?> Delete(int id);
    }
}
