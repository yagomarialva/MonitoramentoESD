using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Org.BouncyCastle.Bcpg.Sig;

namespace BiometricFaceApi.Services
{
    public class StationViewService
    {


        protected readonly IStationViewRepository _stationViewRepository;
        protected readonly IMonitorEsdRepository _monitorEsdRepository;
        protected readonly ILinkStationAndLineRepository _linkRepository;
        protected readonly ILineRepository _lineRepository;
        protected readonly IStationRepository _stationRepository;
        public StationViewService(IStationViewRepository stationViewRepository,
                                  IMonitorEsdRepository monitorEsdRepository,
                                  ILinkStationAndLineRepository linkStationAndLineRepository,
                                  ILineRepository lineRepository,
                                  IStationRepository stationRepository)
        {

            _stationViewRepository = stationViewRepository;
            _monitorEsdRepository = monitorEsdRepository;
            _linkRepository = linkStationAndLineRepository;
            _lineRepository = lineRepository;
            _stationRepository = stationRepository;
        }
        public async Task<(object?, int)> GetAllStationView()
        {
            object? result;
            int statusCode;
            try
            {
                List<StationViewModel> stationView = await _stationViewRepository.GetAllStationView();
                if (!stationView.Any())
                {
                    result = "Nenhuma Linha de Produção foi encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }

                result = stationView;
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
        public async Task<(object?, int)> GetStationViewId(Guid id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _stationViewRepository.GetByStationViewId(id);
                if (monitor == null)
                {
                    result = " Linha de Produção não encontrado.";
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
        public async Task<(object?, int)> GetJigId(Guid id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _stationViewRepository.GetByJigId(id);
                if (monitor == null)
                {
                    result = "Jig não encontrado.";
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
        public async Task<(object?, int)> GetByStationProductionId(Guid id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _stationViewRepository.GetByStationProductionId(id);
                if (monitor == null)
                {
                    result = "Linha de produção não encontrado.";
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
        public async Task<(object?, int)> Include(StationViewModel stationViewModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? result;
            try
            {

                if (stationViewModel.MonitorEsdId <= 0 & stationViewModel.LinkStationAndLineId <= 0)
                {
                    throw new Exception("Todos os campos são obrigatórios.");
                }
                stationViewModel.Created = DateTime.Now;
                stationViewModel.LastUpdated = DateTime.Now;
                result = await _stationViewRepository.Include(stationViewModel);

            }
            catch (Exception exception)
            {
                result = exception.Message ?? "Não foi possível salvar as alterações. Verifique se todos os itens estão cadastrados.";

                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> FactoryView()
        {
            object? result;
            int statusCode;
            try
            {
                List<LineView> lineViews = new List<LineView>();    
                List<StationViewModel> stationView = await _stationViewRepository.GetAllStationView();
                List<LinkStationAndLineModel> Lines = await _linkRepository.GetAllLinks();

                var lines = Lines.Select(st => st.LineID).Distinct().ToList();
                var stations = Lines.Select(st => st.StationID).Distinct().ToList();
                foreach (var line in lines)
                {
                    var lineData = await _lineRepository.GetLineID(line);
                    foreach (var item in Lines.Where(st => st.LineID == line))
                    {
                        item.Line = lineData;
                    }
                }
                foreach (var station in stations)
                {
                    var stationData = await _stationRepository.GetByStationId(station);
                    foreach (var item in Lines.Where(st => st.StationID == station))
                    {
                        item.Station = stationData;
                    }
                }

                var monitors = stationView.Select(st => st.MonitorEsdId).Distinct().ToList();


                foreach (var monitor in monitors)
                {
                    var monitorData = await _monitorEsdRepository.GetByMonitorId(monitor);
                    foreach (var item in stationView.Where(st => st.MonitorEsdId == monitor))
                    {
                        item.MonitorEsd = monitorData;
                    }
                }

                foreach(var line in Lines.DistinctBy(v=>v.LineID).ToList())
                {
                    lineViews.Add(new LineView
                    {
                        Line = line.Line,
                        Stations = Lines.Where(ln=>ln.LineID== line.LineID).Select(v=>new StationView
                        {
                            Station = v.Station,
                            MonitorsEsd = stationView.Where(ln=>ln.LinkStationAndLine.StationID == v.StationID).Select(v=>v.MonitorEsd).ToList()
                        }).ToList(),
                    });
                }
                result = lineViews.ToArray();
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
        public async Task<(object?, int)> Delete(Guid id)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryStationViewDel = await _stationViewRepository.GetByStationViewId(id);
                if (repositoryStationViewDel != null)
                {
                    content = new
                    {
                        ID = repositoryStationViewDel.ID,
                        MonitorEsdId = repositoryStationViewDel.MonitorEsdId,
                        LinkStationAndLineId = repositoryStationViewDel.LinkStationAndLineId

                    };
                    await _stationViewRepository.Delete(repositoryStationViewDel.ID);
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
