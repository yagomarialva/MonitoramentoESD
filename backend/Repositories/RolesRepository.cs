using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using System.Xml.Linq;

namespace BiometricFaceApi.Repositories
{
    public class RolesRepository : IRolesRepository
    {
        private readonly IOracleDataAccessRepository _oraConnector;

        public RolesRepository(IOracleDataAccessRepository oraConnector)
        {
            _oraConnector = oraConnector;
        }

        public async Task<IEnumerable<RolesModel>> GetAllRolesAsync()
        {
            var result = await _oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetAllRoles, new { });
            return result ??
                throw new KeyNotFoundException($"Roles não encontrada.");
        } 

        public async Task<RolesModel?> GetRoleByIdAsync(int id)
        {
            var result = await _oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetRolesById, new { id });
            return result.FirstOrDefault() ?? 
                throw new KeyNotFoundException($"Função com ID {id} não encontrada.");
        }

        public async Task<RolesModel?> GetRoleByNameAsync(string roleName)
        {
            //Tranforma name para letras minusculas, verifica se existe caracters especiais e tira os espçao no final da palavra.
            var roleLower = roleName.Normalize().ToLower().TrimEnd();

            var result = await _oraConnector.LoadData<RolesModel, dynamic>(SQLScripts.GetRolesByRolesName, new { roleLower });
            return result.FirstOrDefault() ?? 
                throw new KeyNotFoundException($"Função com nome {roleName} não encontrada.");
        }

        public async Task<RolesModel?> AddOrUpdateRoleAsync(RolesModel roleModel)
        {
            
            RolesModel rolesUp;
            //Formata o Name para letras minúsculas
            roleModel.RolesName = roleModel.RolesName.ToLowerInvariant();

            if (roleModel.ID > 0)
            {
                // Atualiza
                roleModel.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                await _oraConnector.SaveData(SQLScripts.UpdateRoles, roleModel);
                rolesUp = roleModel;
            }
            else
            {
                // Insere
                roleModel.Created = DateTimeHelperService.GetManausCurrentDateTime();
                roleModel.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                await _oraConnector.SaveData(SQLScripts.InsertRoles, roleModel);
                rolesUp = roleModel;
            }

            // Verifica se ocorreu um erro
            if (_oraConnector.Error != null)
            {
                throw new Exception($"Erro: {_oraConnector.Error}");
            }

            // Retorna o papel atualizado ou recém-criado
            return rolesUp;
        }
        public async Task<RolesModel?> DeleteRoleAsync(int id)
        {
            var roleToDelete = await GetRoleByIdAsync(id);
            await _oraConnector.SaveData<dynamic>(SQLScripts.DeleteRoles, new { id });
            return roleToDelete;
        }
    }
}
