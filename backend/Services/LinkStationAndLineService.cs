using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Org.BouncyCastle.Asn1.Mozilla;

namespace BiometricFaceApi.Services
{
    public class LinkStationAndLineService
    {
        private ILinkStationAndLineRepository _repository;
        private IStationRepository _stationRepository;
        private ILineRepository _lineRepository;
        public LinkStationAndLineService(ILinkStationAndLineRepository linkStationAndLineRepository, IStationRepository stationRepository, ILineRepository lineRepository)
        {
            _repository = linkStationAndLineRepository;
            _stationRepository = stationRepository;
            _lineRepository = lineRepository;
        }
        public async Task<(object?, int)> GetAllLinkStationAndLine()
        {
            object? result;
            int statusCode;
            try
            {
                List<LinkStationAndLineModel> position = await _repository.GetAllLinks();
                if (!position.Any())
                {
                    result = "Nenhuma Link cadastrado.";
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
        public async Task<(object?, int)> GetLinkStationAndLineId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var linkId = await _repository.GetByLinkStationAndLineId(id);
                if (linkId == null)
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = linkId;
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
        public async Task<(object?, int)> GetLineId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var lineId = await _repository.GetByLineId(id);
                if (lineId == null)
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = lineId;
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
        public async Task<(object?, int)> GetStationId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var stationId = await _repository.GetByStationId(id);
                if (stationId == null)
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = stationId;
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
        public async Task<(object?, int)> Include(LinkStationAndLineModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                var line = await _lineRepository.GetLineID(model.LineID);
                var station = await _stationRepository.GetByStationId(model.StationID);
                if (station is null || line is null)
                    throw new Exception("Referência Id de linha ou estação nao é válido.");
                else
                {
                    var existingCobination = _repository.GetByLineIdAndStationId(model.LineID, model.StationID);
                    if (existingCobination is not null)
                        throw new Exception("Esta combinação já constata na base.");
                    response = await _repository.Include(model);
                    statusCode = StatusCodes.Status201Created;
                }
            }
            catch (Exception excepition)
            {
                response = excepition.Message;
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
                var respositoryLink = await _repository.GetByLinkStationAndLineId(id);
                if (respositoryLink.ID > 0)
                {
                    content = new
                    {
                        ID = respositoryLink.ID,
                        LineID = respositoryLink.LineID,
                        StationID = respositoryLink.StationID,

                    };
                    await _repository.Delete(respositoryLink.ID);
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
