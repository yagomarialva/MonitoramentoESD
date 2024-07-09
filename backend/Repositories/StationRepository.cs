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
            return await _dbContext.Station.FirstOrDefaultAsync(x => x.Id == id) ;
        }
        // Task realiza o include e update, include caso nao haja no banco, update caso o bracelet ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationModel?> Include(StationModel stationModel)
        {
            var repositoryStation = await _dbContext.Station.FirstOrDefaultAsync(x => x.Id == stationModel.Id);
            if (repositoryStation is null)
            {
                // include

                stationModel.Created = stationModel.Created ?? DateTime.Now;
                stationModel.LastUpdated = stationModel.LastUpdated ?? DateTime.Now;
                await _dbContext.Station.AddAsync(stationModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update
                repositoryStation.Name = stationModel.Name;
                repositoryStation.Description = stationModel.Description;
                repositoryStation.LastUpdated = DateTime.Now;
                _dbContext.Station.Update(repositoryStation);
                await _dbContext.SaveChangesAsync(); 
            }
            var result = await _dbContext.Station.FirstAsync(x => x.Name == stationModel.Name);

            return result;
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
