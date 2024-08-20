using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata.Ecma335;

namespace BiometricFaceApi.Repositories
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly BiometricFaceDBContex _dbcontex;
        public AuthenticationRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbcontex = biometricFaceDBContex;
        }
        public async Task<AuthenticationModel?> AuthenticateUser(string login, string password)
        {
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(auth => auth.Username == login && auth.Password == password);
            return result;
        }
        public async Task<AuthenticationModel?> AuthGetById(int id)
        {
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(_auth => _auth.ID == id);
            return result;
        }
        public async Task<AuthenticationModel?> AuthGetByUsername(string username)
        {
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(_auth => _auth.Username == username);
            return result;
        }
        public async Task<AuthenticationModel?> AuthGetByBadge(string? badge)
        {
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(x => x.Badge == badge);
            return result;
        }
        public async Task<AuthenticationModel?> AuthInclude(AuthenticationModel login)
        {
           
            await _dbcontex.Auths.AddAsync(login);
            await _dbcontex.SaveChangesAsync();
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(x => x.Username == login.Username);
            return result;


        }
        public async Task<AuthenticationModel?> AuthUpdate(AuthenticationModel login, int id)
        {
            AuthenticationModel authGetById = await AuthGetById(id);
            if (authGetById == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            var update = await _dbcontex.Auths.AsNoTracking().FirstOrDefaultAsync(x => x.ID == login.ID);
            authGetById.Username = login.Username;
            authGetById.Password = login.Password;
            authGetById.RolesName = login.RolesName;
            await _dbcontex.SaveChangesAsync();
            return authGetById;
        }
        public async Task<AuthenticationModel?> AuthDelete(int id)
        {
            AuthenticationModel authenticationModelDel = await AuthGetById(id);
            if (authenticationModelDel != null && authenticationModelDel == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            _dbcontex.Auths.Remove(authenticationModelDel);
            await _dbcontex.SaveChangesAsync();
            return authenticationModelDel;
        }


    }
}
