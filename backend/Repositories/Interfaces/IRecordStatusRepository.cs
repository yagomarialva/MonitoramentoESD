using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IRecordStatusRepository
    {
        Task<List<RecordStatusProduceModel>> GetAllRecordStatusProduces();
        Task<RecordStatusProduceModel?> GetByRecordStatusId(int id);
        Task<RecordStatusProduceModel?> GetByProduceActvId(int id);
        Task<RecordStatusProduceModel?> GetByUserId(int id);
        Task<RecordStatusProduceModel?> Include(RecordStatusProduceModel model);
        Task<RecordStatusProduceModel> Delete(int id);
    }
}
