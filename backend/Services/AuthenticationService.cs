using BiometricFaceApi.Auth;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Security;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.IdentityModel.Tokens;
using MySqlX.XDevAPI;
using Org.BouncyCastle.Asn1.Mozilla;
using Org.BouncyCastle.Crypto.Operators;
using Org.BouncyCastle.Security;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Text;

namespace BiometricFaceApi.Services
{
    public class AuthenticationService
    {
        private IAuthenticationRepository auths;
        private readonly SecurityService securityService;
        private readonly IRolesRepository rolesRepository;
        public AuthenticationService(IAuthenticationRepository auths, JwtAuthentication jwt, SecurityService securityService, IRolesRepository rolesRepository)
        {
            this.auths = auths;
            this.securityService = securityService;
            this.rolesRepository = rolesRepository;
        }

        // User authentication method
        public async Task<AuthenticationModel?> AuthenticateUser(LoginModel login)
        {
            AuthenticationModel? user = null;
            if (!string.IsNullOrEmpty(login?.Username?.Trim()) && !string.IsNullOrEmpty(login?.Password?.Trim()))
            {
                user = await auths.AuthenticateUser(login.Username, securityService.EncryptAES(login.Password));
            }
            return user;
        }

        // Utilizando a mesma rota é possível atualizar e inserir usuários autenticados
        public async Task<(object?, int)> ManagerAuth(AuthenticationModel auth)
        {
            object? content = null;
            int statusCode = StatusCodes.Status200OK;

            try
            {
                //get all valid roles
                var roles = await rolesRepository.GetAllRoles();
                if (string.IsNullOrEmpty(auth.Username))
                {
                    throw new Exception("O nome do usuário não pode ser nulo.");
                }
                if (roles != null && !roles.Where(r => r.RolesName?.ToLower() == auth.RolesName?.ToLower()).Any())
                {
                    throw new Exception("Perfil selecionado é inválido!");
                }
                if (auth != null)
                {
                    auth.Password = securityService.EncryptAES(auth.Password);
                    var repositoryAuths = await auths.AuthGetByBadge(auth.Badge);
                    if (repositoryAuths != null && repositoryAuths.Id > 0)
                    {
                        //update
                        repositoryAuths.Id = repositoryAuths.Id;
                        await auths.AuthUpdate(auth, repositoryAuths.Id);
                        var updateAuthentication = new AuthenticationModel
                        {
                            Id = repositoryAuths.Id,
                            Badge = auth.Badge,
                            Username = auth.Username,
                            Password = auth.Password,
                            RolesName = auth.RolesName?.ToLower()
                        };
                        content = updateAuthentication;

                    }
                    else
                    {
                        // include
                        auth.RolesName = auth.RolesName?.ToLower();
                        repositoryAuths = await auths.AuthInclude(auth);
                        if (repositoryAuths == null)
                        {
                            throw new Exception("Dados incorretos ou inválidos.");
                        }
                        else
                        {
                            content = repositoryAuths;
                            statusCode = StatusCodes.Status201Created;
                        }
                    }
                }
                else
                {
                    throw new Exception("Objeto de autenticação inválido!");
                }
            }
            catch (Exception exception)
            {
                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }

        // Pesquise usuários autenticados por ID
        public async Task<(object?, int)> GetAtuhById(int authId)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryAtuhs = await auths.AuthGetById(authId);
                if (repositoryAtuhs != null && repositoryAtuhs.Id > 0)
                {
                    var result = await auths.AuthGetById(authId);
                    content = new
                    {
                        Id = repositoryAtuhs.Id,
                        Username = repositoryAtuhs.Username,
                        Badge = repositoryAtuhs.Badge,
                        Password = repositoryAtuhs.Password,
                        RolesName = repositoryAtuhs.RolesName
                    };
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos";
                    statusCode = StatusCodes.Status400BadRequest;
                }
            }
            catch (Exception exception)
            {
                content = exception.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (content, statusCode);
        }

        // Realizar exclusão por usuários autenticados por ID
        public async Task<(object?, int)> DelByAtuh(int id)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryAtuhs = await auths.AuthGetById(id);
                if (repositoryAtuhs != null && repositoryAtuhs.Id > 0)
                {
                    await auths.AuthDelete(repositoryAtuhs.Id);
                    content = new
                    {
                        Id = repositoryAtuhs.Id,
                        UserName = repositoryAtuhs.Username,
                        Badge = repositoryAtuhs.Badge,
                    };
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos";
                    statusCode = StatusCodes.Status400BadRequest;
                }
            }
            catch (Exception ex)
            {
                content = ex.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (content, statusCode);
        }

    }
}
