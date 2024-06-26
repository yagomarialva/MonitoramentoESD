using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class ActivityDetailsRepository : IActivityDetailsRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public ActivityDetailsRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }

        public async Task<List<ActivityDetailsModel>> GetAllActivityDetails()
        {
            return await _dbContext.ActivityDetails.ToListAsync();
        }

        public async Task<ActivityDetailsModel> GetActivityDetailsId(int id)
        {
            var result = await _dbContext.ActivityDetails.FirstOrDefaultAsync(x => x.Id == id) ?? new ActivityDetailsModel();
            return result;
        }

        public async Task<ActivityDetailsModel> GetProduceActivityDesc(string description)
        {
            var result = await _dbContext.ActivityDetails.FirstOrDefaultAsync(x => x.Description == description) ?? new ActivityDetailsModel();
            return result;
        }

        public async Task<ActivityDetailsModel> GetProduceActivityId(int id)
        {
            var result = await _dbContext.ActivityDetails.FirstOrDefaultAsync(x => x.ProduceActivityId == id) ?? new ActivityDetailsModel();
            return result;
        }

        public async Task<ActivityDetailsModel?> Include(ActivityDetailsModel model)
        {
            await _dbContext.ActivityDetails.AddAsync(model);
            await _dbContext.SaveChangesAsync();
            var result = await _dbContext.ActivityDetails.FirstAsync(x => x.ProduceActivityId == model.ProduceActivityId);
            return result;
        }

        public async Task<ActivityDetailsModel?> Update(ActivityDetailsModel model)
        {
            ActivityDetailsModel activitymodelUp = await GetProduceActivityId(model.ProduceActivityId);

            if (activitymodelUp == null)
            {
                throw new Exception($"O Atividade para ID:{model.ProduceActivityId} não foi encontrado no banco de dados.");
            }

            activitymodelUp.ProduceActivity = model.ProduceActivity;

            var update = await _dbContext.ActivityDetails.AsNoTracking().FirstOrDefaultAsync(x => x.ProduceActivityId == model.ProduceActivityId);
            activitymodelUp.Description = model.Description;
            _dbContext.ActivityDetails.Update(activitymodelUp);
            await _dbContext.SaveChangesAsync();
            return activitymodelUp;
        }

        public async Task<ActivityDetailsModel> Delete(int id)
        {
            ActivityDetailsModel activityDel = await GetActivityDetailsId(id);
            if (activityDel == null)
            {
                throw new Exception($"A atividade para ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.ActivityDetails.Remove(activityDel);
            await _dbContext.SaveChangesAsync();
            return activityDel;
        }
    }
}
