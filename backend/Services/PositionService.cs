using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using System.Drawing;

namespace BiometricFaceApi.Services
{
    public class PositionService
    {
        private IPositionRepository _repository;
        public PositionService(IPositionRepository repository)
        {
            _repository = repository;
        }

        public async Task<(object?, int)> GetAllPositions()
        {
            object? result;
            int statusCode;
            try
            {
                List<PositionModel> position = await _repository.GetAllPositions();
                if (!position.Any())
                {
                    result = "Nenhuma Posição cadastrada.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = position;
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
        public async Task<(object?, int)> GetPositionId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var position = await _repository.GetPositionId(id);
                if (position == null)
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = position;
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
        public async Task<(object?, int)> GetSizeX(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var position = await _repository.GetSizeX(id);
                if (position == null)
                {

                    result = $"Size X com {id}  não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = position;
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
        public async Task<(object?, int)> GetSizeY(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var position = await _repository.GetSizeY(id);
                if (position == null)
                {

                    result = $"Size Y com {id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = position;
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
        public async Task<(object?, int)> Include(PositionModel postionModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await _repository.Include(postionModel);
                statusCode = StatusCodes.Status201Created;
            }
            catch (Exception)
            {
                response = "Verifique se todos os Dados estão cadastrados na Base de Dados";
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
                var respositorySize = await _repository.GetPositionId(id);
                if (respositorySize.ID > 0)
                {
                    content = new
                    {
                        id = respositorySize.ID,
                        sizeX = (int)respositorySize.SizeX,
                        sizeY = (int)respositorySize.SizeY,

                    };
                    await _repository.Delete(respositorySize.ID);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    throw new Exception("Dados incorretos ou inválidos.");
                }
            }
            catch (Exception)
            {

                content = $"{id} não encontrado.";
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }
    }
}
