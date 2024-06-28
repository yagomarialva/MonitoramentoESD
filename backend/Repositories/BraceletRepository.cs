using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class BraceletRepository : IBraceletRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public BraceletRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<BraceletModel>> GetAllBracelets()
        {
            return await _dbContext.Bracelet.ToListAsync();
        }
        public async Task<BraceletModel> GetByBraceletId(int id)
        {
            return await _dbContext.Bracelet.FirstOrDefaultAsync(x => x.Id == id) ?? new BraceletModel();
        }
        public async Task<BraceletModel?> GetByBreceletSn(string? sn)
        {
            return await _dbContext.Bracelet.FirstOrDefaultAsync(x => x.Sn == sn);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso o bracelet ja 
        // tenha alguma propriedade cadastrada.
        public async Task<BraceletModel?> Include(BraceletModel braceletModel)
        {
            var repositoryBracelet = await _dbContext.Bracelet.FirstOrDefaultAsync(x => x.Id == braceletModel.Id);
            if (repositoryBracelet is null)
            {
                //include
                await _dbContext.Bracelet.AddAsync(braceletModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                //update
                var update = await _dbContext.Bracelet.AsNoTracking().FirstOrDefaultAsync(x => x.Id == braceletModel.Id);
                braceletModel.Id = braceletModel.Id;
                _dbContext.Bracelet.Update(braceletModel);
                await _dbContext.SaveChangesAsync();
            }
            var result = await _dbContext.Bracelet.FirstAsync(x => x.Id == braceletModel.Id);

            return result;

        }

        public async Task<BraceletModel> Delete(int id)
        {
            BraceletModel braceletModelDel = await GetByBraceletId(id);
            _dbContext.Bracelet.Remove(braceletModelDel);
            await _dbContext.SaveChangesAsync();
            return braceletModelDel;
        }
    }
}
