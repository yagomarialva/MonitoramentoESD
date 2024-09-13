using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class RolesRepository : IRolesRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;

        public RolesRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }


        public async Task<List<RolesModel>> GetAllRoles()
        {
            var result = await oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetAllRoles, new { });
            return result;
        }

        public async Task<RolesModel?> GetByRolesId(int id)
        {
            var result = await oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetRolesById, new { id });
            return result.FirstOrDefault();
        }

        public async Task<RolesModel?> GetByRolesName(string rolesName)
        {
            var result = await oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetRolesByRolesName, new { rolesName });
            return result.FirstOrDefault();
        }

        public async Task<RolesModel?> Include(RolesModel rolesModel)
        {
            RolesModel rolesUp;
            if (rolesModel.ID > 0)
            {
                //update
                await oraConnector.SaveData(SQLScripts.UpdateRoles, rolesModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                rolesUp = await GetByRolesName(rolesModel.RolesName);
            }
            else
            {
                //include
                await oraConnector.SaveData<RolesModel>(SQLScripts.InsertRoles, rolesModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                rolesUp = await GetByRolesName(rolesModel.RolesName);
            }
            return rolesUp;

        }

        public async Task<RolesModel?> Delete(int id)
        {
            RolesModel? rolesDel = await GetByRolesId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteRoles, new { id });
            return rolesDel;
        }

        
    }
}
