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
        public async Task<List<StationModel>> GetAllStation()
        {
            return await repository.GetAllStation();
        }
        public async Task<StationModel> GetStationId(int id)
        {
            return await repository.GetByStationId(id);
        }
        public async Task<(object?, int)> Include(StationModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await repository.Include(model);
            }
            catch (Exception ex)
            {
                response = ex.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (response, statusCode);
        }
        public async Task<StationModel> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }

}
