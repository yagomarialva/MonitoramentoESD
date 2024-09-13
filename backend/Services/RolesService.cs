using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class RolesService
    {
        private IRolesRepository _repository;
        public RolesService(IRolesRepository repository)
        {
            _repository = repository;
        }
        public async Task<(object?, int)> GetAllRoles()
        {
            object? result;
            int statusCode;
            try
            {
                List<RolesModel> roles = await _repository.GetAllRoles();
                if (!roles.Any())
                {
                    result = "Nenhuma Role cadastrada.";
                    statusCode = StatusCodes.Status400BadRequest;
                    return (result, statusCode);
                }
                result = roles;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exception)
            {

                result = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                return (result, statusCode);
            }
           
        }
        public async Task<(object?, int)> GetByRolesId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByRolesId(id);
                if (station == null)
                {
                    result = ("Roles Id não encontrado.");
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                result = station;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exception)
            {
                result = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                return (result, statusCode);
            }
           

        }
        public async Task<(object?, int)> GetByRoleNameId(string rolesName)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByRolesName(rolesName);
                if (station == null)
                {
                    result = ("Roles Name não encontrado.");
                    statusCode = StatusCodes.Status404NotFound;
                    
                }
                result = station;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exception)
            {
                result = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                
            }
            return (result, statusCode);

        }
        public async Task<(object?, int)> Include(RolesModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await _repository.Include(model);
                statusCode = StatusCodes.Status200OK;
                return (response, statusCode);
            }
            catch (Exception)
            {
                response = "Verificar  dados se estão corretos.";
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (response, statusCode);
        }
        public async Task<(object?, int)> Delete(int id)
        {
            object? content;
            int statusCode;
            try
            {
                var repositorRoles = await _repository.GetByRolesId(id);
                if (repositorRoles.ID > 0)
                {
                    content = new
                    {
                        id = repositorRoles.ID,
                        rolesName = repositorRoles.RolesName,


                    };
                    await _repository.Delete(repositorRoles.ID);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos";
                    statusCode = StatusCodes.Status404NotFound;
                }
            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }

            return (content, statusCode);
        }
    }
}
