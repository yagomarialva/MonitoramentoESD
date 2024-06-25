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
        public async Task<BraceletModel?> Include(BraceletModel bracelet)
        {
            if (bracelet == null)
            {
                throw new ArgumentNullException("a Pulseira ESD não pode ser nulo.");
            }
            BraceletModel? braceletModelUp = await GetByBreceletSn(bracelet.Sn);
            if (braceletModelUp == null)
            {
                // include
                await _dbContext.Bracelet.AddAsync(bracelet);
                await _dbContext.SaveChangesAsync();

                var savedBracelet = _dbContext.Bracelet.FirstOrDefault(newBracelet => newBracelet.Sn == bracelet.Sn);
                bracelet.Id = savedBracelet.Id;
            }
            else
            {
                // update
                var update = await _dbContext.BraceletAttrib.AsNoTracking().FirstOrDefaultAsync(x => x.Id == bracelet.Id);
                bracelet.Id = braceletModelUp.Id;
                braceletModelUp = bracelet;
                await _dbContext.Bracelet.AddAsync(bracelet);
                await _dbContext.SaveChangesAsync();
            }

            return bracelet;
        }
        public async Task<BraceletModel> Delete(int id)
        {
            BraceletModel braceletModelDel = await GetByBraceletId(id);
            if (braceletModelDel == null)
            {
                throw new Exception($"A Pulseira ESD com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Bracelet.Remove(braceletModelDel);
            await _dbContext.SaveChangesAsync();
            return braceletModelDel;
        }
    }
}
