using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

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
                var position = await _repository.GetAllLinks();
                var linesAll = await _lineRepository.GetAllLine();
                var stationAll = await _stationRepository.GetAllStation();
                if (position == null || !position.Any())
                {
                    result = "Nenhuma Link cadastrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    var stations = position.Select(x => x.StationID).Distinct().ToList();
                    var lines = position.Select(x => x.LineID).Distinct().ToList();
                    foreach (var station in stations)
                    {
                        var stationData = stationAll.Where(x => x.ID == station).FirstOrDefault();
                        foreach (var item in position.Where(x => x.StationID == station))
                        {
                            item.Station = stationData;
                        }
                    }
                    foreach (var line in lines)
                    {
                        var lineData = linesAll.Where(x => x.ID == line).FirstOrDefault();
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
                var linkId = await _repository.GetByLinkId(id);
                if (linkId == null)
                {

                    result = $"{id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
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

                    result = $"ID {id} não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                else
                {
                    var lineDetails = await _lineRepository.GetLineID(links.FirstOrDefault().LineID);
                    foreach (var link in links)
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
                var linkStationLine = await _repository.GetAllLinks();
                var linesAll = await _lineRepository.GetAllLine();
                var stationAll = await _stationRepository.GetAllStation();
                var currentStation = stationAll.Find(station => station.ID == model.StationID);
                var currentLine = linesAll.Find(line => line.ID == model.LineID);
                if (currentLine is null || currentStation  is null)
                    throw new Exception("Referência Id de linha ou estação nao é válido.");
                else
                {
                    var existingCobination = await _repository.GetByLineIdAndStationId(model.LineID, model.StationID);
                    if (existingCobination is not null)
                        throw new Exception("Esta combinação já consta na base.");

                    var oldOrdersList = linkStationLine.Find(x => x.OrdersList == model.OrdersList);
                    var oldReferenceThisModel = linkStationLine.Find(x => x.ID == model.ID);

                    if (oldOrdersList is not null && oldReferenceThisModel is not null && oldOrdersList.ID != oldReferenceThisModel.ID)
                    {
                        oldOrdersList.OrdersList = oldReferenceThisModel.OrdersList;
                        await _repository.Include(oldOrdersList);
                    }


                    model.Station = stationAll.Find(station => station.ID == model.StationID);
                    model.Line = linesAll.Find(line => line.ID == model.LineID);

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
                var respositoryLink = await _repository.GetByLinkId(id);
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
