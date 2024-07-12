using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IRolesRepository
    {
        Task<List<RolesModel>> GetAllRoles();
        Task<RolesModel?> GetByRolesId(int id);
        Task<RolesModel?> GetByRolesName(string rolesName);
        Task<RolesModel?> Include(RolesModel rolesModel);
        Task<RolesModel?> Delete(int id);
        
       
    }

}
