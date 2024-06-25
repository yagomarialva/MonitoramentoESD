using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Repositories
{
    public class ProduceActivityRepository : IProduceActivityRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public ProduceActivityRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<ProduceActivityModel>> GetAllProduceActivity()
        {
            return await _dbContext.ProduceActivity.ToListAsync();
        }
        public async Task<ProduceActivityModel> GetByProduceActivityId(int id)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.Id == id) ?? new ProduceActivityModel();
        }
        public async Task<ProduceActivityModel> GetByProduceBraceltId(int braceletProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.BraceletId == braceletProduce) ?? new ProduceActivityModel();
        }
        public async Task<ProduceActivityModel> GetByProduceMonitorId(int monitorProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.MonitorEsdId == monitorProduce) ?? new ProduceActivityModel();
        }
        public async Task<ProduceActivityModel> GetByProduceStationId(int stationProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.StationId == stationProduce) ?? new ProduceActivityModel();
        }
        public async Task<ProduceActivityModel> GetByProduceUserId(int usersProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.UserId == usersProduce) ?? new ProduceActivityModel();
        }
        // Task realiza o include e update, include caso nao haja dados cadastrados no banco e update caso o ProduceEvent ja 
        // tenha alguma propriedade cadastrada.
        public async Task<ProduceActivityModel?> Include(ProduceActivityModel produceActivity)
        {
            if (produceActivity == null)
            {
                throw new ArgumentNullException("Atividade de Produção não pode ser nulo.");
            }
            ProduceActivityModel produceActivityModelUp = await GetByProduceActivityId(produceActivity.Id);
            if (produceActivityModelUp == null)
            {
                // include
                await _dbContext.ProduceActivity.AddAsync(produceActivity);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update
                var update = await _dbContext.ProduceActivity.AsNoTracking().FirstOrDefaultAsync(x => x.Id == produceActivity.Id);
                produceActivity.Id = produceActivityModelUp.Id;
                produceActivityModelUp = produceActivity;
                await _dbContext.ProduceActivity.AddAsync(produceActivity);
                await _dbContext.SaveChangesAsync();
            }

            return produceActivity;
        }
        public async Task<ProduceActivityModel> Delete(int id)
        {
            ProduceActivityModel produceActivityModelDel = await GetByProduceActivityId(id);
            if (produceActivityModelDel == null)
            {
                throw new Exception($"Atividade de Produção com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.ProduceActivity.Remove(produceActivityModelDel);
            await _dbContext.SaveChangesAsync();
            return produceActivityModelDel;
        }
    }
}
