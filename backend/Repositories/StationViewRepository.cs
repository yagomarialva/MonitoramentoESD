using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BiometricFaceApi.Repositories
{
    public class StationViewRepository : IStationViewRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public StationViewRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<StationViewModel>> GetAllStationView()
        {
            return await _dbContext.StationViews.ToListAsync();
        }

        public async Task<StationViewModel?> GetByStationViewId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<StationViewModel?> GetByJigId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<StationViewModel?> GetByStationProductionId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationViewModel?> Include(StationViewModel stationView)
        {

            StationViewModel? stationModelUp = await GetByStationViewId(stationView.Id);
            if (stationModelUp == null)
            {
                // include
                await _dbContext.StationViews.AddAsync(stationView);
                await _dbContext.SaveChangesAsync();

            }
            else
            {
                // update
                stationModelUp.JigId = stationView.JigId;
                stationModelUp.StationId = stationView.StationId;
                _dbContext.StationViews.Update(stationModelUp);
                await _dbContext.SaveChangesAsync();
            }
            return stationView;
        }
        public async Task<StationViewModel> Delete(int id)
        {
            StationViewModel lineviewDel = await GetByStationViewId(id);
            if (lineviewDel == null)
            {
                throw new Exception($"Station View com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.StationViews.Remove(lineviewDel);
            await _dbContext.SaveChangesAsync();
            return lineviewDel;
        }


    }
}
