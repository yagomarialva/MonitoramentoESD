using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class JigRepository : IJigRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public JigRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<JigModel>> GetAllJig()
        {
            return await _dbContext.Jigs.ToListAsync();
        }
        public async Task<JigModel?> GetByJigId(int jigId)
        {
            return await _dbContext.Jigs.FirstOrDefaultAsync(x => x.ID == jigId);
        }
        public async Task<JigModel?> GetByName(string jigName)
        {
            return await _dbContext.Jigs.FirstOrDefaultAsync(x => x.Name == jigName);
        }

        public async Task<JigModel?> GetByPosition(int postionId)
        {
            return await _dbContext.Jigs.FirstOrDefaultAsync(x => x.PositionID == postionId);
        }
        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<JigModel?> Include(JigModel jigModel)
        {
            var repositoryJig = await _dbContext.Jigs.FirstOrDefaultAsync(x => x.ID == jigModel.ID);
            if (repositoryJig is null)
            {
                // include

                jigModel.Created = jigModel.Created ?? DateTime.Now;
                jigModel.LastUpdated = jigModel.LastUpdated ?? DateTime.Now;
                await _dbContext.Jigs.AddAsync(jigModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update
                repositoryJig.Name = jigModel.Name;
                repositoryJig.Position = jigModel.Position;
                repositoryJig.Description = jigModel.Description;
                repositoryJig.LastUpdated = DateTime.Now;
                _dbContext.Jigs.Update(repositoryJig);
                await _dbContext.SaveChangesAsync();
            }
            var result = await _dbContext.Jigs.FirstAsync(x => x.Name == jigModel.Name);

            return result;
        }
        public async Task<JigModel> Delete(int id)
        {
            JigModel stationModelDel = await GetByJigId(id);
            if (stationModelDel == null)
            {
                throw new Exception($"Jig com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Jigs.Remove(stationModelDel);
            await _dbContext.SaveChangesAsync();
            return stationModelDel;
        }

    }
}
