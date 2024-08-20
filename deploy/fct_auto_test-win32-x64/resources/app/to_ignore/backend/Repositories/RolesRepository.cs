using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class RolesRepository : IRolesRepository
    {
        private readonly BiometricFaceDBContex _dbContext;

        public RolesRepository(BiometricFaceDBContex dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<List<RolesModel>> GetAllRoles()
        {
            return await _dbContext.Roles.ToListAsync();
        }

        public async Task<RolesModel?> GetByRolesId(int id)
        {
            return await _dbContext.Roles.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<RolesModel?> GetByRolesName(string rolesName)
        {
            return await _dbContext.Roles.FirstOrDefaultAsync(x => x.RolesName == rolesName);
        }

        public async Task<RolesModel?> Include(RolesModel rolesModel)
        {
            RolesModel? rolesUp = await GetByRolesId(rolesModel.ID);
            if (rolesUp == null)
            {
                // include
                await _dbContext.Roles.AddAsync(rolesModel);
                await _dbContext.SaveChangesAsync();
                rolesModel = await GetByRolesName(rolesModel.RolesName);
            }
            else
            {
                // update
                rolesUp.ID = rolesModel.ID;
                rolesUp.RolesName = rolesModel.RolesName;
                _dbContext.Roles.Update(rolesUp);
                await _dbContext.SaveChangesAsync();
            }
            return rolesModel;

        }

        public async Task<RolesModel?> Delete(int id)
        {
            RolesModel rolesDel = await GetByRolesId(id);
            _dbContext.Roles.Remove(rolesDel);
            await _dbContext.SaveChangesAsync();
            return rolesDel;
        }

        
    }
}
