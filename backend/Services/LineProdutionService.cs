using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class LineProdutionService
    {
        private ILineProductionRepository _lineProductionRepository;
        public LineProdutionService(ILineProductionRepository lineProductionRepository)
        {
            _lineProductionRepository = lineProductionRepository;
        }
        public async Task<(object?, int)> GetAllLineProduction()
        {
            object? result;
            int statusCode;
            try
            {
                List<LineProductionModel> lineProdution = await _lineProductionRepository.GetAllLines();
                if (!lineProdution.Any())
                {
                    result = "Nenhuma Linha de Produção cadastrada.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = lineProdution;
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
        public async Task<(object?, int)> GetLineProductionId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _lineProductionRepository.GetByLineId(id);
                if (monitor == null)
                {

                    result = "Linha de produção não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = monitor;
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

        public async Task<(object?, int)> GetByProduceActId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _lineProductionRepository.GetByProduceActId(id);
                if (monitor == null)
                {

                    result = "Atividade de Produção não encontrada.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = monitor;
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
        public async Task<(object?, int)> Include(LineProductionModel lineProductionModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await _lineProductionRepository.Include(lineProductionModel);
                statusCode = StatusCodes.Status200OK;
            }
            catch (Exception exception)
            {
                response = exception.Message;
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
                var respositoryLinewProd = await _lineProductionRepository.GetByLineId(id);
                if (respositoryLinewProd.Id > 0)
                {
                    content = new
                    {
                        Id = respositoryLinewProd.Id,
                        Nmae = respositoryLinewProd.Name,
                        ProduceActivityId = respositoryLinewProd.ProduceActivityId,
                        
                    };
                    await _lineProductionRepository.Delete(respositoryLinewProd.Id);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    throw new Exception("Dados incorretos ou inválidos.");
                }
            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }
    }
}
