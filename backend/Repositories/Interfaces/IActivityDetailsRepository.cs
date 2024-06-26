using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IActivityDetailsRepository
    {
        Task<List<ActivityDetailsModel>> GetAllActivityDetails();
        Task<ActivityDetailsModel> GetActivityDetailsId(int id);
        Task<ActivityDetailsModel> GetProduceActivityId(int id);
        Task<ActivityDetailsModel> GetProduceActivityDesc(string description);
        Task<ActivityDetailsModel?> Include(ActivityDetailsModel model);
        Task<ActivityDetailsModel?> Update(ActivityDetailsModel model);
        Task<ActivityDetailsModel> Delete(int id);
    }
}
