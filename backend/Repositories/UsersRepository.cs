using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{

    public class UsersRepository : IUsersRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public UsersRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<UserModel>> GetAllUsers()
        {
            return await _dbContext.Users.ToListAsync();
        }

        public async Task<UserModel> ForId(int id)
        {
            var result = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == id) ?? new UserModel();
            return result;
        }
        public async Task<UserModel> ForBadge(string badge)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Badge == badge) ?? new UserModel();
        }
        public async Task<UserModel?> GetByName(string name)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(x => x.Name == name) ?? new UserModel();
        }

        public async Task<UserModel?> Include(UserModel user)
        {
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            var result = await _dbContext.Users.FirstAsync(x => x.Badge == user.Badge);
            return result;

        }
        public async Task<UserModel> Update(UserModel user, int id)
        {
            UserModel userModelUp = await ForId(id);

            if (userModelUp == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            var update = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Id == user.Id);
            userModelUp.Name = user.Name;
            _dbContext.Users.Update(userModelUp);
            await _dbContext.SaveChangesAsync();
            return userModelUp;
        }
        public async Task<UserModel> Delete(int id)
        {
            UserModel userModelDel = await ForId(id);
            if (userModelDel == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Users.Remove(userModelDel);
            await _dbContext.SaveChangesAsync();
            return userModelDel;
        }

        
    }
}

