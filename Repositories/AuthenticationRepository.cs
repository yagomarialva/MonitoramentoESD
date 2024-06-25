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
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(auth => auth.Login == login && auth.Password == password);
            return result;
        }
        public async Task<AuthenticationModel?> AuthGetById(int id)
        {
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(_auth => _auth.Id == id);
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
            var result = await _dbcontex.Auths.FirstOrDefaultAsync(x => x.Login == login.Login);
            return result;


        }
        public async Task<AuthenticationModel?> AuthUpdate(AuthenticationModel login, int id)
        {
            AuthenticationModel authGetById = await AuthGetById(id);
            if (authGetById == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            var update = await _dbcontex.Auths.AsNoTracking().FirstOrDefaultAsync(x => x.Id == login.Id);
            authGetById.Login = login.Login;
            authGetById.Password = login.Password;
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
