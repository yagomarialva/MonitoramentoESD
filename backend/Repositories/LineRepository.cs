using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace BiometricFaceApi.Repositories
{
    public class LineRepository : ILineRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;

        public LineRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<LineModel>> GetAllLine()
        {
            var result = await oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetAllLine, new { });
            return result;
        }

        public async Task<LineModel> GetLineID(int id)
        {
            var result = await oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetLineById, new { id });
            return result.FirstOrDefault();
        }

        public async Task<LineModel?> GetLineName(string name)
        {
            var result = await oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetLineByName, new { name });
            return result.FirstOrDefault();
        }

        public async Task<LineModel?> Include(LineModel lineModel)
        {


            if (lineModel.ID > 0)
            {
                await oraConnector.SaveData(SQLScripts.UpdateLine, lineModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
            }
            else
            {
                //include
                await oraConnector.SaveData<LineModel>(SQLScripts.InsertLine, lineModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                lineModel = await GetLineID(lineModel.ID);


            }
            return lineModel;
        }
        public async Task<LineModel?> Delete(int id)
        {
            LineModel? line = await GetLineID(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteLine, new { id });
            return line;
        }
    }
}
