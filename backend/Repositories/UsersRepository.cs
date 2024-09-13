using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using BiometricFaceApi.OraScripts;
using System.Xml.Linq;
namespace BiometricFaceApi.Repositories
{

    public class UsersRepository : IUsersRepository
    {
        //private readonly BiometricFaceDBContex _dbContext;
        private readonly IOracleDataAccessRepository oraConnector;
        public UsersRepository(IOracleDataAccessRepository oracleConnector)
        {
           // _dbContext = biometricFaceDBContex;
            this.oraConnector = oracleConnector;
        }
        public async Task<List<UserModel>> GetAllUsers()
        {
            var users =await oraConnector.LoadData<UserModel, dynamic>(SQLScripts.GetAllUsers,new {});

            return users;
        }

        public async Task<UserModel?> ForId(int id)
        {
            var result = await oraConnector.LoadData<UserModel, dynamic>(SQLScripts.GetUserById, new { id});
            return result.FirstOrDefault();
        }
        public async Task<UserModel?> ForBadge(string badge)
        {
            var result = await oraConnector.LoadData<UserModel, dynamic>(SQLScripts.GetUserByBadge, new { badge });
            return result.FirstOrDefault();
        }
        public async Task<UserModel?> GetByName(string name)
        {
            var result = await oraConnector.LoadData<UserModel, dynamic>(SQLScripts.GetUserByName, new { name });
            return result.FirstOrDefault();
        }

        public async Task<UserModel?> Include(UserModel user)
        {
            await oraConnector.SaveData<UserModel>(SQLScripts.InsertUser, user);
            var result = await ForBadge(user.Badge);
            return result;

        }
        public async Task<UserModel> Update(UserModel user, int id)
        {
            UserModel userModelUp = await ForId(id);

            if (userModelUp == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<UserModel>(SQLScripts.UpdateUser, user);
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");
            user.ID = userModelUp.ID;
            return user;
        }
        public async Task<UserModel> Delete(int id)
        {
            UserModel userModelDel = await ForId(id);
            if (userModelDel == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteUser,new {id = id }); 
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");
            return userModelDel;
        }

        public async Task<UserModel> checkUser(string name)
        {
            var result = await oraConnector.LoadData<UserModel, dynamic>(SQLScripts.checkUserQuery, new { name });
            return result.FirstOrDefault();
        }
    }
}

