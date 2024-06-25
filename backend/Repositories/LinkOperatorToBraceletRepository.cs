using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class LinkOperatorToBraceletRepository : ILinkOperatorToBraceletRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public LinkOperatorToBraceletRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<LinkOperatorToBraceletModel>> GetAllLinkOperatortToBracelet()
        {
            return await _dbContext.LinkOperatorToBracelet.ToListAsync();
        }
        public async Task<LinkOperatorToBraceletModel> GetByLinkOperatorToBraceletId(int id)
        {
            return await _dbContext.LinkOperatorToBracelet.FirstOrDefaultAsync(x => x.Id == id) ?? new LinkOperatorToBraceletModel();
        }
        public async Task<LinkOperatorToBraceletModel> GetByLinkOperatorToUserID(int linkUserId)
        {
            return await _dbContext.LinkOperatorToBracelet.FirstOrDefaultAsync(x => x.UserId == linkUserId) ?? new LinkOperatorToBraceletModel();
        }
        public async Task<LinkOperatorToBraceletModel?> Include(LinkOperatorToBraceletModel linkOperatorModel)
        {
            await _dbContext.LinkOperatorToBracelet.AddAsync(linkOperatorModel);
            await _dbContext.SaveChangesAsync();
            var result = await _dbContext.LinkOperatorToBracelet.FirstAsync(x => x.Id == linkOperatorModel.Id);
            return result;
        }
        public async Task<LinkOperatorToBraceletModel?> Update(LinkOperatorToBraceletModel linkOperatorModel, int id)
        {
            LinkOperatorToBraceletModel linkModelUp = await GetByLinkOperatorToBraceletId(id);

            if (linkModelUp == null)
            {
                throw new Exception($"O link para ID:{id} não foi encontrado no banco de dados.");
            }
            var update = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == linkOperatorModel.Id);
            linkModelUp.UserId = linkOperatorModel.UserId;
            linkModelUp.BraceletId = linkOperatorModel.BraceletId;
            _dbContext.LinkOperatorToBracelet.Update(linkModelUp);
            await _dbContext.SaveChangesAsync();
            return linkModelUp;
        }
        public async Task<LinkOperatorToBraceletModel?> Delete(int id)
        {
            LinkOperatorToBraceletModel linkModelDel = await GetByLinkOperatorToBraceletId(id);
            if (linkModelDel == null)
            {
                throw new Exception($"O link para ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.LinkOperatorToBracelet.Remove(linkModelDel);
            await _dbContext.SaveChangesAsync();
            return linkModelDel;
        }
    }
}
