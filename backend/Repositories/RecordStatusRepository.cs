using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;


namespace BiometricFaceApi.Repositories
{
    public class RecordStatusRepository : IRecordStatusRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public RecordStatusRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<RecordStatusProduceModel>> GetAllRecordStatusProduces()
        {
            var result = await oraConnector.LoadData<RecordStatusProduceModel, dynamic>(SQLScripts.GetAllRecordStatus, new { });
            return result;
        }

        public async Task<RecordStatusProduceModel?> GetByRecordStatusId(int id)
        {
            var result = await oraConnector.LoadData<RecordStatusProduceModel, dynamic>(SQLScripts.GetRecordStatusById, new {id });
            return result.FirstOrDefault();
        }

        public async Task<RecordStatusProduceModel?> GetByProduceActvId(int produceActivityId)
        {
            var result = await oraConnector.LoadData<RecordStatusProduceModel, dynamic>(SQLScripts.GetRecordProduceActId, new { produceActivityId });
            return result.FirstOrDefault();
        }

        public async Task<RecordStatusProduceModel?> GetByUserId(int userId)
        {
            var result = await oraConnector.LoadData<RecordStatusProduceModel, dynamic>(SQLScripts.GetRecordProduceUserId, new { userId });
            return result.FirstOrDefault();
        }


        public async Task<RecordStatusProduceModel?> Include(RecordStatusProduceModel recordModel)
        {
            RecordStatusProduceModel? recordUp;
            if (recordModel.ID > 0)
            {
                //update
                await oraConnector.SaveData(SQLScripts.UpdateRecordStatusProduce, recordModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                recordUp = recordModel;
            }
            else
            {
                //include
                await oraConnector.SaveData<RecordStatusProduceModel>(SQLScripts.InsereRecordStatusProduce, recordModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                recordUp = await GetByRecordStatusId(recordModel.ID);
            }
            return recordUp;
        }


        public async Task<RecordStatusProduceModel> Delete(int id)
        {
            RecordStatusProduceModel? recordDel = await GetByRecordStatusId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteRecordStatusProduce, new { id });
            return recordDel;
        }


    }
}
