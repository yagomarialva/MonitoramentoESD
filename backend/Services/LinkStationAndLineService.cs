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
                List<LinkStationAndLineModel>? position = await _repository.GetAllLinks();

                if (position==null ||!position.Any())
                {
                    result = "Nenhuma Link cadastrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    var stations = position.Select(x => x.StationID).Distinct().ToList();
                    var lines = position.Select(x=>x.LineID).Distinct().ToList();   
                    foreach(var station in stations)
                    {
                        var stationData = await _stationRepository.GetByStationId(station);
                        foreach(var item in position.Where(x => x.StationID == station))
                        {
                            item.Station = stationData;
                        }
                    }
                    foreach (var line in lines)
                    {
                        var lineData = await _lineRepository.GetLineID(line);
                        foreach (var item in position.Where(x => x.LineID == line))
                        {
                            item.Line = lineData;
                        }
                    }
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
                var links = await _repository.GetByLineId(id);
                if (links == null || !links.Any())
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    var lineDetails = await _lineRepository.GetLineID(links.FirstOrDefault().LineID);
                    foreach(var link in links)
                    {
                        link.Line = lineDetails;
                        link.Station = await _stationRepository.GetByStationId(link.StationID);
                    }

                }
                result = links;
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
                var links = await _repository.GetByStationId(id);
                if (links == null || !links.Any())
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    var stationDetails = await _stationRepository.GetByStationId(links.FirstOrDefault().StationID);
                    foreach (var link in links)
                    {
                        link.Station = stationDetails;
                        link.Line = await _lineRepository.GetLineID(link.LineID);
                    }

                }
                result = links;
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
                    var existingCobination = await _repository.GetByLineIdAndStationId(model.LineID, model.StationID);
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
