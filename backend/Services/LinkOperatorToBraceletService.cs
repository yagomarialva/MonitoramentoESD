using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Org.BouncyCastle.Crypto.Operators;

namespace BiometricFaceApi.Services
{
    public class LinkOperatorToBraceletService
    {
        private ILinkOperatorToBraceletRepository repository;
        public LinkOperatorToBraceletService(ILinkOperatorToBraceletRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<LinkOperatorToBraceletModel>> GetAllLinks()
        {
            return await repository.GetAllLinkOperatortToBracelet();
        }
        public async Task<LinkOperatorToBraceletModel> GetLinkOperatorToBraceletId(int id)
        {
            return await repository.GetByLinkOperatorToBraceletId(id);
        }
        public async Task<LinkOperatorToBraceletModel> GetLinkOperatorToUserID(int id)
        {
            return await repository.GetByLinkOperatorToUserID(id);
        }
        public async Task<LinkOperatorToBraceletModel?> Include(LinkOperatorToBraceletModel LinkModel)
        {
            return await repository.Include(LinkModel);
        }
        public async Task<LinkOperatorToBraceletModel?> Update(LinkOperatorToBraceletModel linkOperatorModel, int id)
        {
            linkOperatorModel.DatatimeEvent = DateTime.Now;
            return await repository.Update(linkOperatorModel, id);
        }
        public async Task<LinkOperatorToBraceletModel?> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }
}
