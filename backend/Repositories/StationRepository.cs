using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

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
            return await _dbContext.Station.FirstOrDefaultAsync(x => x.ID == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationModel?> Include(StationModel stationModel)
        {
            StationModel? station = await GetByStationId(stationModel.ID);
            if (station is null)
            {
                // include 
                await _dbContext.Station.AddAsync(stationModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                //update 
                station.Name = stationModel.Name;
                station.LastUpdated = DateTime.Now;
                _dbContext.Station.Update(station);
                await _dbContext.SaveChangesAsync();
            }

            var result = await _dbContext.Station.FirstOrDefaultAsync(x => x.ID == stationModel.ID);
            return result;
        }
        public async Task<StationModel> Delete(int id)
        {
            StationModel lineProductionModelDel = await GetByStationId(id);
            if (lineProductionModelDel == null)
            {
                throw new Exception($"Linha de produção com o :{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Station.Remove(lineProductionModelDel);
            await _dbContext.SaveChangesAsync();
            return lineProductionModelDel;
        }


    }
}
