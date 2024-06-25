using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public StationRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<StationModel>> GetAllStation()
        {
            return await _dbContext.Station.ToListAsync();
        }
        public async Task<StationModel> GetByStationId(int id)
        {
            return await _dbContext.Station.FirstOrDefaultAsync(x => x.Id == id) ?? new StationModel();
        }
        // Task realiza o include e update, include caso nao haja no banco, update caso o bracelet ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationModel?> Include(StationModel stationModel)
        {
            if (stationModel == null)
            {
                throw new ArgumentNullException("Estação não pode ser nulo");
            }
            StationModel? stationModelUp = await GetByStationId(stationModel.Id);
            if (stationModelUp == null)
            {
                // include
                await _dbContext.Station.AddAsync(stationModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update
                var update = await _dbContext.Station.AsNoTracking().FirstOrDefaultAsync(x => x.Id == stationModel.Id);
                stationModel.Id = stationModelUp.Id;
                stationModelUp = stationModel;
                await _dbContext.Station.AddAsync(stationModel);
                await _dbContext.SaveChangesAsync();
            }

            return stationModel;
        }
        public async Task<StationModel> Delete(int id)
        {
            StationModel stationModelDel = await GetByStationId(id);
            if (stationModelDel == null)
            {
                throw new Exception($"A Estação com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Station.Remove(stationModelDel);
            await _dbContext.SaveChangesAsync();
            return stationModelDel;
        }
    }
}
