using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Security;
using System;
using System.Threading.Tasks;

namespace BiometricFaceApi.Repositories
{
    public class DbInitializerRepository : IDbInitializerRepository
    {
        private readonly IOracleDataAccessRepository _oraConnector;
        private readonly SecurityService _securityService;

        public DbInitializerRepository(IOracleDataAccessRepository oraConnector, SecurityService securityService)
        {
            _oraConnector = oraConnector;
            _securityService = securityService;
        }

        public async Task InitializeAsync()
        {
            try
            {
                const string username = "admin";
                const string password = "Admcompal123!";
                const string badge = "compal";
                const string role = "administrator";

                // Criptografar a senha
                var adminPasswordEncrypted = _securityService.EncryptAES(password);

                // Verificar se o usuário já existe
                var userCount = await _oraConnector.LoadData<AuthenticationModel, dynamic>(SQLScripts.checkUserQuery, new { username });


                if (userCount.FirstOrDefault()?.ID <=0)
                {
                    // Inserir o usuário administrador
                    await _oraConnector.SaveData<AuthenticationModel>(SQLScripts.insertAdminUserQuery, new AuthenticationModel
                    {
                        Username = username,
                        Password = adminPasswordEncrypted,
                        Badge = badge,
                        RolesName = role
                    });
                }
            }
            catch (Exception ex)
            {
                // Log e trate exceções de forma adequada
                // Exemplo: logger.LogError(ex, "Erro ao inicializar o banco de dados.");
                throw new InvalidOperationException("Erro ao inicializar o banco de dados.", ex);
            }
        }


    }
}
