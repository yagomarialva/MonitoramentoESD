using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using System.Reflection.Metadata;

namespace BiometricFaceApi.Services
{
    public class LineService
    {
        private ILineRepository _repository;
        public LineService(ILineRepository lineRepository)
        {
            _repository = lineRepository;
        }
        public async Task<(object?, int)> GetAllLine()
        {
            object? content;
            int statusCode;
            try
            {
                List<LineModel> line = await _repository.GetAllLine();
                if (!line.Any())
                {
                    content = "Nenhuma linha cadastrada.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (content, statusCode);
                }
                else
                {
                    line.ForEach(async prod =>
                    {
                        prod.ID = prod.ID;
                        prod.Name = prod.Name;
                    });

                    content = line;
                    statusCode = StatusCodes.Status200OK;
                }
                return (content, statusCode);

            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                return (content, statusCode);
            }

        }
        public async Task<(object?, int)> GetLineId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetLineID(id);
                if (monitor == null)
                {
                    result = $"ID:{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                result = monitor;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exception)
            {
                result = exception.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (result, statusCode);

        }
        public async Task<(object?, int)> GetLineName(string lineName)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetLineName(lineName);
                if (monitor == null)
                {
                    result = $"{lineName} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                result = monitor;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exception)
            {
                result = exception.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (result, statusCode);

        }
        public async Task<(object?, int)> Include(LineModel lineModel)
        {
            object? content;
            int statusCode;
            try
            {
                    content = await _repository.Include(lineModel);
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
                var repositoryLine = await _repository.GetLineID(id);
                if (repositoryLine != null)
                {
                    content = new
                    {
                        Id = repositoryLine.ID,
                        nome = repositoryLine.Name
                    };
                    await _repository.Delete(repositoryLine.ID);
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
