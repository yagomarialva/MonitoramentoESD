using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class BraceletAttributeService
    {
        private IBraceletAttributeRepository repository;
        public BraceletAttributeService(IBraceletAttributeRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<BraceletAttributeModel>> GetAllAttributes()
        {
            return await repository.GetAllBraceletsAtt();
        }
       public async Task<BraceletAttributeModel> GetByAttibeById(int id)
        {
            return await repository.GetByAttribId(id);
        }
        public async Task<BraceletAttributeModel?> GetByPropertyName(string name)
        {
            return await repository.GetByPropertyName(name);
        }
        public async Task<BraceletAttributeModel> Include (BraceletAttributeModel model)
        {
            return await repository.Include(model);
        }
        public async Task<BraceletAttributeModel> Update(BraceletAttributeModel model, int id)
        {
            return await repository.Update(model, id);
        }
        public async Task<BraceletAttributeModel> Delete (int id)
        {
            return await repository.Delete(id);
        }
    }
}