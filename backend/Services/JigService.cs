using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class JigService
    {
        private IJigRepository _repository;

        public JigService(IJigRepository repository)
        {
            _repository = repository;

        }
        public async Task<(object?, int)> GetAllJigs()
        {
            object? result;
            int statusCode;
            try
            {
                List<JigModel> jigs = await _repository.GetAllJig();
                if (!jigs.Any())
                {
                    result = ("Nenhum Jig cadastrado.");
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    result = jigs;
                    statusCode = StatusCodes.Status200OK;
                    return (result, statusCode);
                }

            }
            catch (Exception exeption)
            {

                result = exeption.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> GetJigId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByJigId(id);
                if (station == null)
                {
                    result = ("Jig Id não encontrado.");
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
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> GetName(string name)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByName(name);
                if (station == null)
                {
                    result = ("Jig Id não encontrado.");
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
        public async Task<(object?, int)> Include(JigModel model)
        {
            object? content;
            int statusCode;
            try
            {
                JigModel? lineUp = await _repository.GetByJigId(model.ID);
                model.ID = lineUp != null ? lineUp.ID : model.ID;
                content = await _repository.Include(model);
                if (model.ID > 0)
                    statusCode = StatusCodes.Status200OK;
                else
                    statusCode = StatusCodes.Status201Created;
            }
            catch (Exception)
            {
                content = "Verificar  dados se estão corretos.";
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }
        public async Task<(object?, int)> Delete(int id)
        {
            object? content;
            int statusCode;
            try
            {
                var repositorJig = await _repository.GetByJigId(id);
                if (repositorJig != null && repositorJig.ID > 0)
                {
                   
                    await _repository.Delete(repositorJig.ID);
                    content = repositorJig;
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
