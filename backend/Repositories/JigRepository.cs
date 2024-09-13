using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace BiometricFaceApi.Repositories
{
    public class JigRepository : IJigRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public JigRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<JigModel>> GetAllJig()
        {
            var result = await oraConnector.LoadData<JigModel, dynamic>(SQLScripts.GetAllJig, new { });
            return result;
        }
        public async Task<JigModel?> GetByJigId(int id)
        {
            var result = await oraConnector.LoadData<JigModel, dynamic>(SQLScripts.GetJigId, new { id });
            return result.FirstOrDefault();
        }
        public async Task<JigModel?> GetByName(string name)
        {
            var result = await oraConnector.LoadData<JigModel, dynamic>(SQLScripts.GetJigName, new { name });
            return result.FirstOrDefault();
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<JigModel?> Include(JigModel jigModel)
        {
            if (jigModel.ID > 0)
            {
                // update 
                await oraConnector.SaveData(SQLScripts.UpdateJig, jigModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                jigModel = await GetByJigId(jigModel.ID);
            }
            else
            {
                //insert 
                await oraConnector.SaveData<JigModel>(SQLScripts.InsertJig, jigModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                jigModel = await GetByName(jigModel.Name);
            }

            return jigModel;
        }
        public async Task<JigModel?> Delete(int id)
        {
            JigModel? jigDel = await GetByJigId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteJig, new { id });
            return jigDel;
        }

    }
}
