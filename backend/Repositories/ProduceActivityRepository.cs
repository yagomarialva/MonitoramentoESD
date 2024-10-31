using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;

namespace BiometricFaceApi.Repositories
{
    public class ProduceActivityRepository : IProduceActivityRepository
    {
        private readonly IOracleDataAccessRepository _oraConnector;

        public ProduceActivityRepository(IOracleDataAccessRepository oraConnector)
        {
            _oraConnector = oraConnector;
        }

        public async Task<List<ProduceActivityModel>> GetAllAsync()
        {
            return await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetAllProcuceAct, new { });
        }

        public async Task<ProduceActivityModel?> GetByIdAsync(int id)
        {
            var result = await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetProduceActById, new { id });
            return result.FirstOrDefault();
        }

        public async Task<ProduceActivityModel?> GetByMonitorIdAsync(int monitorProduce)
        {
            var result = await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetMonitorActById, new { monitorProduce });
            return result.FirstOrDefault();
        }

        public async Task<ProduceActivityModel?> GetByJigIdAsync(int jigProduce)
        {
            var result = await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetJigActById, new { jigProduce });
            return result.FirstOrDefault();
        }

        public async Task<ProduceActivityModel?> GetByUserIdAsync(int userId)
        {
            var result = await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetUserActById, new { userId });
            return result.FirstOrDefault();
        }

        public async Task<ProduceActivityModel?> GetByLinkStationAndLineIdAsync(int linkStationAndLineId)
        {
            var result = await _oraConnector.LoadData<ProduceActivityModel, dynamic>(SQLScripts.GetLinkStationAndLineById, new { linkStationAndLineId });
            return result.FirstOrDefault();
        }
        public async Task<ProduceActivityModel?> IsLockedAsync(int id, int locked)
        {
            var result = await GetByIdAsync(id);

            // Converte boolean value para 0 ou 1 
            int lockdValue = (locked == 1) ? 1 : 0;  // locked = 1 -> true, locked != 1 -> false

            if (result != null)
            {
                result.IsLocked = lockdValue; // Atualiza o status de IsLocked (booleano)
                result.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();

                await _oraConnector.SaveData<ProduceActivityModel>(SQLScripts.UpdateProduceAct, result);
                
            }
            else
                throw new Exception($"Erro ao atualizar atividade de produção: {_oraConnector.Error}");
            return result;
        }

        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do ProduceActivityID, senso assim possibilitando a alteração de dados.
        public async Task<ProduceActivityModel?> AddOrUpdateAsync(ProduceActivityModel produceActivity)
        {
            if (produceActivity.ID > 0)
            {
                // Atualização
                produceActivity.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                await _oraConnector.SaveData<ProduceActivityModel>(SQLScripts.UpdateProduceAct, produceActivity);

                if (_oraConnector.Error != null)
                {
                    throw new Exception($"Erro ao atualizar atividade de produção: {_oraConnector.Error}");
                }
            }
            else
            {
                // Inclusão
                produceActivity.Created = DateTimeHelperService.GetManausCurrentDateTime();
                produceActivity.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                await _oraConnector.SaveData<ProduceActivityModel>(SQLScripts.InsertProduceAct, produceActivity);

                if (_oraConnector.Error != null)
                {
                    throw new Exception($"Erro ao incluir atividade de produção: {_oraConnector.Error}");
                }
            }

            return produceActivity;
        }

        public async Task<ProduceActivityModel?> DeleteAsync(int id)
        {
            var produceActivity = await GetByIdAsync(id);

            if (produceActivity == null)
            {
                throw new ArgumentException("ID de atividade de produção inválido.");
            }

            await _oraConnector.SaveData<dynamic>(SQLScripts.DeleteProduceAct, new { id });

            if (_oraConnector.Error != null)
            {
                throw new Exception($"Erro ao deletar atividade de produção: {_oraConnector.Error}");
            }

            return produceActivity;
        }
    }
}