using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class LinkStationAndLineRepository : ILinkStationAndLineRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;

        public LinkStationAndLineRepository(IOracleDataAccessRepository oracleDataAccessRepository)
        {
            oraConnector = oracleDataAccessRepository;
        }
        public async Task<List<LinkStationAndLineModel>> GetAllLinks()
        {
            var result = await oraConnector.LoadData<LinkStationAndLineModel, dynamic>(SQLScripts.GetAllLinks, new { });
            return result;
        }
        public async Task<List<LinkStationAndLineModel>?> GetByLineId(int id)
        {
            var result = await oraConnector.LoadData<LinkStationAndLineModel, dynamic>(SQLScripts.GetByLineId, new { id});
            return result;
        }
        public async Task<LinkStationAndLineModel?> GetByLinkId(int id)
        {
            var result = await oraConnector.LoadData<LinkStationAndLineModel, dynamic>(SQLScripts.GetByLinkId, new { id });
            return result.FirstOrDefault();
        }
        public async Task<List<LinkStationAndLineModel>?> GetByStationId(int id)
        {
            var result = await oraConnector.LoadData<LinkStationAndLineModel, dynamic>(SQLScripts.GetByLinkStationId, new { id });
            return result; 
        }
        public async Task<LinkStationAndLineModel?> GetByLineIdAndStationId(int lineId, int stationId)
        {
            var result = await oraConnector.LoadData<LinkStationAndLineModel, dynamic>(SQLScripts.GetByLinkLineAndStationById, new { lineId,stationId });
            return result.FirstOrDefault();
        }
        public async Task<LinkStationAndLineModel?> Include(LinkStationAndLineModel model)
        {
            LinkStationAndLineModel? linkAndModelUp;
            if (model.ID > 0)
            {
                //update
                await oraConnector.SaveData(SQLScripts.UpdateLinkAndStation, model);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                linkAndModelUp = model;
            }
            else
            {
                //include
                await oraConnector.SaveData<LinkStationAndLineModel>(SQLScripts.InsertLinkAndStation, model);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                linkAndModelUp = await GetByLineIdAndStationId(model.LineID,model.StationID);
            }
            return linkAndModelUp;
        }
        public async Task<LinkStationAndLineModel> Delete(int id)
        {
            LinkStationAndLineModel? linkAndStationDel = await GetByLinkId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteLinkAndStation, new { id });
            return linkAndStationDel;
        }
    }
}
