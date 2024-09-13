using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace BiometricFaceApi.Repositories
{
    public class ProduceActivityRepository : IProduceActivityRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public ProduceActivityRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<ProduceActivityModel>> GetAllProduceActivity()
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetAllProcuceAct, new { });
            return result;
        }
        public async Task<ProduceActivityModel?> GetByProduceActivityId(int id)
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetProduceActById, new { id });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> GetByProduceMonitorId(int monitorProduce)
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetMonitorActById, new { monitorProduce });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> GetByProduceJigId(int jigProduce)
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetJigActById, new { jigProduce });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> GetByProduceUserId(int usersProduce)
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetUserActById, new { usersProduce });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> GetByLinkAndStationId(int LinkStationAndLineId )
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetLinkStationAndLineById, new { LinkStationAndLineId });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> Islocked(int id, bool locked)
        {
            var result = await oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetIsLockedId, new { id });
            if (result != null && result.Any())
            {
                result.FirstOrDefault().IsLocked = locked;
                oraConnector.SaveData(SQLScripts.UpdateProduceAct, result);
            }
            else
                throw new Exception("Id inválido.");
            return result.FirstOrDefault();
        }

        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do ProduceActivityID, senso assim possibilitando a alteração de dados.
        public async Task<ProduceActivityModel?> Include(ProduceActivityModel produceModel)
        {
            ProduceActivityModel? produceUp;
            if (produceModel.ID > 0)
            {
                // update
                await oraConnector.SaveData(SQLScripts.UpdateProduceAct, produceModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                produceUp = produceModel;
            }
            else 
            {
                //include 
                await oraConnector.SaveData<ProduceActivityModel>(SQLScripts.InsertProduceAct, produceModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                produceUp = await GetByProduceUserId( produceModel.ID );
            }
            return produceUp;
   
        }
        public async Task<ProduceActivityModel?> Delete(int id)
        {
            ProduceActivityModel? produceDel = await GetByProduceActivityId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteProduceAct, new { id });
            return produceDel;
        }

    }
}