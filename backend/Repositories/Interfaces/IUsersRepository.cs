using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IUsersRepository
    {
        Task<List<UserModel>> GetAllUsers();
        Task<UserModel> ForId(int id);
        Task<UserModel> ForBadge(string badge);
        Task<UserModel> ForRolesName(string rolesName);
        Task<UserModel?> Include(UserModel user);
        Task<UserModel> Update(UserModel user, int Id);
        Task<UserModel> Delete( int id);
    }
}
