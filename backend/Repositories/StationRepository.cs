using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace BiometricFaceApi.Repositories
{
    public class StationRepository : IStationRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public StationRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<StationModel>> GetAllStation()
        {
            var result = await oraConnector.LoadData<StationModel, dynamic>(SQLScripts.GetAllLStation, new { });
            return result;
        }
        public async Task<StationModel> GetByStationId(int id)
        {
            var result = await oraConnector.LoadData<StationModel, dynamic>(SQLScripts.GetStationId, new { id });
            return result.FirstOrDefault();
        }
        public async Task<StationModel> GetByStationName(string name)
        {
            var result = await oraConnector.LoadData<StationModel, dynamic>(SQLScripts.GetStationName, new { name });
            return result.FirstOrDefault();
        }
        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationModel?> Include(StationModel stationModel)
        {
            if (stationModel.ID > 0)
            {
                // update 
                await oraConnector.SaveData(SQLScripts.UpdateStation, stationModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                stationModel = await GetByStationId(stationModel.ID);
            }
            else
            {
                //insert 
                await oraConnector.SaveData<StationModel>(SQLScripts.InsertStation, stationModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                stationModel = await GetByStationName(stationModel.Name);
            }

            return stationModel;
        }
        public async Task<StationModel> Delete(int id)
        {
            StationModel? stationDel = await GetByStationId(id);
            if (stationDel == null)
            {
                throw new Exception($" Estação com ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteStation, new { id });
            return stationDel;
        }
    }
}
