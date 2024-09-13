using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

using System.Security.Policy;
namespace BiometricFaceApi.Services
{
    public class UserService
    {
        private IUsersRepository users;
        public UserService(IUsersRepository users)
        {
            this.users = users;
        }
        public async Task<List<UserModel>> GetAllUsers()
        {

            return await users.GetAllUsers();
        }
        public async Task<UserModel> GetUserById(int id)
        {

            return await users.ForId(id);
        }
        public async Task<UserModel> GetUserByBadge(string badge)
        {

            return await users.ForBadge(badge);
        }

        public async Task<UserModel?>GetByName (string name)
        {
            return await users.GetByName(name);
        }
        public async Task<UserModel?> Include(UserModel user)
        {
           return await users.Include(user);
        }
        public async Task<UserModel> Update(UserModel user, int id)
        {
            return await users.Update(user, id);
        }
        public async Task<UserModel> Delete(int id)
        {
            return await users.Delete(id);
        }


    }
}
