using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Repositories
{
    public class LineProductionRepository : ILineProductionRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public LineProductionRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<LineProductionModel>> GetAllLines()
        {
            return await _dbContext.LineProduction.ToListAsync();
        }

        public async Task<LineProductionModel> GetByLineId(int id)
        {
            return await _dbContext.LineProduction.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<LineProductionModel> GetByProduceActId(int id)
        {
            return await _dbContext.LineProduction.FirstOrDefaultAsync(x => x.Id == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<LineProductionModel?> Include(LineProductionModel lineModel)
        {
            var repositoryLineProduction = await _dbContext.LineProduction.FirstOrDefaultAsync(x => x.Id == lineModel.Id);
            if (repositoryLineProduction is null)
            {
                // include 

                lineModel.Created = lineModel.Created ?? DateTime.Now;
                lineModel.LastUpdated = lineModel.LastUpdated ?? DateTime.Now;
                await _dbContext.LineProduction.AddAsync(lineModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                //update 

                repositoryLineProduction.Name = lineModel.Name;
                repositoryLineProduction.ProduceActivity = lineModel.ProduceActivity;
                repositoryLineProduction.LastUpdated = DateTime.Now;
                _dbContext.LineProduction.Update(repositoryLineProduction);
                await _dbContext.SaveChangesAsync();
            }

            var result = await _dbContext.LineProduction.FirstOrDefaultAsync(x => x.Id == lineModel.Id);
            return result;
        }
        public async Task<LineProductionModel> Delete(int id)
        {
            LineProductionModel lineProductionModelDel = await GetByLineId(id);
            if (lineProductionModelDel == null)
            {
                throw new Exception($"Linha de produção com o :{id} não foi encontrado no banco de dados.");
            }
            _dbContext.LineProduction.Remove(lineProductionModelDel);
            await _dbContext.SaveChangesAsync();
            return lineProductionModelDel;
        }


    }
}
