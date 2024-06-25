using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class ProduceActivityService
    {
        private IProduceActivityRepository repository;
        public ProduceActivityService(IProduceActivityRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<ProduceActivityModel>> GetProduceAct()
        {
            return await repository.GetAllProduceActivity();
        }
        public async Task<ProduceActivityModel> GetProduceId(int id)
        {
            return await repository.GetByProduceActivityId(id);
        }
        public async Task<ProduceActivityModel> GetProduceBraceletId(int braceletProduce)
        {
            return await repository.GetByProduceBraceltId(braceletProduce);
        }
        public async Task<ProduceActivityModel> GetProduceMonitorId(int monitorProduce)
        {
            return await repository.GetByProduceMonitorId(monitorProduce);
        }
        public async Task<ProduceActivityModel> GetProduceStationId(int stationProduce)
        {
            return await repository.GetByProduceStationId(stationProduce);
        }
        public async Task<ProduceActivityModel> GetProduceUserId(int userProduce)
        {
            return await repository.GetByProduceUserId(userProduce);
        }
        public async Task<ProduceActivityModel?> Include(ProduceActivityModel produceModel)
        {
            produceModel.DatatimeEvent = DateTime.Now;
            return await repository.Include(produceModel);
        }
        public async Task<ProduceActivityModel> Delete(int id)
        {
            return await repository.Delete(id);
        }
    }
}
