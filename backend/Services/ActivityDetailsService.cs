using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Services
{
    public class ActivityDetailsService
    {
        private IActivityDetailsRepository _actvRepository;
        public ActivityDetailsService(IActivityDetailsRepository repository)
        {
            _actvRepository = repository;
        }
        public async Task<List<ActivityDetailsModel>> GetAllActivityDetails()
        {
            return await _actvRepository.GetAllActivityDetails();
        }
        public async Task<ActivityDetailsModel> GetActivityDetailsId(int id)
        {
            return await _actvRepository.GetActivityDetailsId(id);
        }
        public async Task<ActivityDetailsModel>GetProduceActivityId(int id)
        {
            return await _actvRepository.GetProduceActivityId(id);
        }
        public async Task<ActivityDetailsModel>GetProduceActivityDes(string desription)
        {
            return await _actvRepository.GetProduceActivityDesc(desription);
        }
        public async Task<ActivityDetailsModel?> Include (ActivityDetailsModel model)
        {
            return await _actvRepository.Include(model);
        }
        public async Task<ActivityDetailsModel?> Update(ActivityDetailsModel model)
        {
            return await _actvRepository.Update(model);
        }
        public async Task<ActivityDetailsModel?> Delete(int id)
        {
            return await _actvRepository.Delete(id);
        }
    }
}
