using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class StationAttributeService
    {
        private IStationAttributeRepository repository;
        public StationAttributeService(IStationAttributeRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<StationAttributeModel>> GetStation()
        {
            return await repository.GetAllStationAtt();
        }
        public async Task<StationAttributeModel> GetStationAttId(int id)
        {
            return await repository.GetByAttribId(id);
        }
        public async Task<StationAttributeModel> GetByStationId(int id)
        {
            return await repository.GetByStationId(id);
        }
        public async Task<StationAttributeModel?> GetPropertyNameId(string propertyName)
        {
            return await repository.GetByPropertyName(propertyName);
        }
        public async Task<StationAttributeModel?> Include(StationAttributeModel StaitonAttmodel)
        {
            return await repository.Include(StaitonAttmodel);
        }
        public async Task<StationAttributeModel> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }
}
