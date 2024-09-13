using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Oracle.ManagedDataAccess.Client;
using System.Reflection.Metadata.Ecma335;

namespace BiometricFaceApi.Repositories
{
    public class AuthenticationRepository : IAuthenticationRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public AuthenticationRepository(IOracleDataAccessRepository oracleConnector)
        {
            this.oraConnector = oracleConnector;
        }
        public async Task<AuthenticationModel?> AuthenticateUser(string _username, string _password)
        {
            var username = _username.Trim();
            var password = _password.Trim();
            var result = await oraConnector.LoadData<AuthenticationModel, dynamic>(SQLScripts.AuthentitateUser, new {username ,password });
            return result.FirstOrDefault();
        }
        public async Task<AuthenticationModel?> AuthGetById(int id)
        {
            var result = await oraConnector.LoadData<AuthenticationModel, dynamic>(SQLScripts.GetAuthenticationById, new { id });
            return result.FirstOrDefault();
        }
        public async Task<AuthenticationModel?> AuthGetByUsername(string username)
        {
            var result = await oraConnector.LoadData<AuthenticationModel, dynamic>(SQLScripts.GetAuthenticationByUserName, new { username });
            return result.FirstOrDefault();
        }
        public async Task<AuthenticationModel?> AuthGetByBadge(string? badge)
        {
            var result = await oraConnector.LoadData<AuthenticationModel, dynamic>(SQLScripts.GetAuthenticationByBadge, new { badge });
            return result.FirstOrDefault();
        }
        public async Task<AuthenticationModel?> AuthInclude(AuthenticationModel login)
        {
            await oraConnector.SaveData<AuthenticationModel>(SQLScripts.InsertAuthetication, login);
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");
            var result = await AuthGetByUsername(login.Username);
            return result;
        }
        public async Task<AuthenticationModel?> AuthUpdate(AuthenticationModel login, int id)
        {
            AuthenticationModel authenticationUp = await AuthGetById(id);
            if (authenticationUp == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<AuthenticationModel>(SQLScripts.UpdateAuthetication, login);
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");
            login.ID = authenticationUp.ID;
            return authenticationUp;
        }
        public async Task<AuthenticationModel?> AuthDelete(int id)
        {
            AuthenticationModel? authenticationDel = await AuthGetById(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteMonitor, new { id });
            return authenticationDel;
        }


    }
}
