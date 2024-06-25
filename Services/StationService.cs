using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class StationService
    {
        private IStationRepository repository;
        public StationService(IStationRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<StationModel>> GetStation()
        {
            return await repository.GetAllStation();
        }
        public async Task<StationModel> GetStationId(int id)
        {
            return await repository.GetByStationId(id);
        }
        public async Task<StationModel?> Include(StationModel model)
        {
            return await repository.Include(model);
        }
        public async Task<StationModel> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }

}
