using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class StationService
    {
        private IStationRepository _stationRepository;
        public StationService(IStationRepository lineProductionRepository)
        {
            _stationRepository = lineProductionRepository;
        }
        public async Task<(object?, int)> GetAllStation()
        {
            object? result;
            int statusCode;
            try
            {
                List<StationModel> lineProdution = await _stationRepository.GetAllStation();
                if (!lineProdution.Any())
                {
                    result = "Nenhuma Estação cadastrada.";
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
        public async Task<(object?, int)> GetStationId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _stationRepository.GetByStationId(id);
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
        public async Task<(object?, int)> Include(StationModel stationModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                if (string.IsNullOrEmpty(stationModel.Name))
                {
                    throw new Exception("Nome obrigatório.");
                }
                stationModel.Created = DateTime.Now;
                stationModel.LastUpdated = DateTime.Now;
                response = await _stationRepository.Include(stationModel);
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
                var respositoryLinewProd = await _stationRepository.GetByStationId(id);
                if (respositoryLinewProd.Id > 0)
                {
                    content = new
                    {
                        Id = respositoryLinewProd.Id,
                        Nmae = respositoryLinewProd.Name,
                        
                        
                    };
                    await _stationRepository.Delete(respositoryLinewProd.Id);
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
