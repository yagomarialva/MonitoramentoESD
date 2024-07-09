using BiometricFaceApi.Models;
using System.Globalization;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IAuthenticationRepository
    {
        Task<AuthenticationModel?> AuthenticateUser(string login, string password);
        Task<AuthenticationModel?> AuthInclude(AuthenticationModel userAuth);
        Task<AuthenticationModel?> AuthUpdate(AuthenticationModel login, int id);
        Task<AuthenticationModel?> AuthGetById(int id);
        Task<AuthenticationModel?> AuthGetByUsername(string username);
        Task<AuthenticationModel?> AuthGetByBadge(string? id);
        Task<AuthenticationModel?> AuthDelete(int id);
        
    }
}