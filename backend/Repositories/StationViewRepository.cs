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

        public async Task<StationViewModel> GetByStationViewId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<StationViewModel> GetByJigId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<StationViewModel> GetByStationProductionId(int id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.Id == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationViewModel?> Include(StationViewModel stationViewModel)
        {
            StationViewModel? stationView = await GetByStationViewId(stationViewModel.Id);
            if (stationView is null)
            {
                // include

                
                await _dbContext.StationViews.AddAsync(stationView);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update

                stationView.JigId = stationViewModel.JigId;
                stationView.StationId = stationViewModel.StationId;
                stationView.LastUpdated = DateTime.Now;
                _dbContext.StationViews.Update(stationView);
                await _dbContext.SaveChangesAsync();
            }
            var result = await _dbContext.StationViews.FirstAsync(x => x.Id == stationViewModel.Id);

            return result;
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
