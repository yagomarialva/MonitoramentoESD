using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class BraceletService
    {
        private IBraceletRepository repository;
        public BraceletService (IBraceletRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<BraceletModel>> GetAllBracelets()
        {
            return await repository.GetAllBracelets();
        }
        public async Task<BraceletModel> GetBraceletId(int id)
        {
            return await repository.GetByBraceletId(id);
        }
        public async Task<BraceletModel?> GetBraceletSn(string sn)
        {
            return await repository.GetByBreceletSn(sn);
        }
        public async  Task<BraceletModel?> Include(BraceletModel model)
        {
            return await repository.Include(model);
        }
        public async Task<BraceletModel> Delete (int id)
        {
            return await repository.Delete(id);
        }
    }
}
