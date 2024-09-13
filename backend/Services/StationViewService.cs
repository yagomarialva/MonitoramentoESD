using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;


namespace BiometricFaceApi.Services
{
    public class StationViewService
    {


        protected readonly IStationViewRepository _stationViewRepository;
        protected readonly IMonitorEsdRepository _monitorEsdRepository;
        protected readonly ILinkStationAndLineRepository _linkRepository;
        protected readonly ILineRepository _lineRepository;
        protected readonly IStationRepository _stationRepository;
        protected readonly LinkStationAndLineService _linkStationAndLineService;
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
            _linkStationAndLineService = new LinkStationAndLineService(linkStationAndLineRepository, stationRepository, lineRepository);
        }
        public async Task<(object? Result, int StatusCode)> GetAllStationView()
        {
            try
            {
                var monitorEds = await _monitorEsdRepository.GetAllMonitor();
                var (data, status) = await _linkStationAndLineService.GetAllLinkStationAndLine();
                var LinkStaionAndLines = data != null ? (List<LinkStationAndLineModel>)data : new List<LinkStationAndLineModel>();
                var stationView = await _stationViewRepository.GetAllStationView();
                if (!stationView.Any())
                {
                    return ("Nenhuma Linha de Produção foi encontrada.", StatusCodes.Status404NotFound);
                }
                stationView.ForEach(station =>
                {
                    station.LinkStationAndLine = LinkStaionAndLines.Find(link => link.ID == station.LinkStationAndLineId);
                    station.MonitorEsd = monitorEds.Find(monitor => monitor.ID == station.MonitorEsdId);
                });
                return (stationView, StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                return (ex.Message ?? "Erro ao processar a solicitação.", StatusCodes.Status500InternalServerError);
            }
        }
        public async Task<(object? Result, int StatusCode)> GetStationViewId(int id)
        {
            try
            {
                var monitor = await _stationViewRepository.GetByStationViewId(id);
                if (monitor == null)
                {
                    return ("Linha de Produção não encontrada.", StatusCodes.Status404NotFound);
                }
                return (monitor, StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                return (ex.Message ?? "Erro ao processar a solicitação.", StatusCodes.Status500InternalServerError);
            }
        }
        public async Task<(object? Result, int StatusCode)> Include(StationViewModel stationViewModel)
        {
            if (stationViewModel.MonitorEsdId <= 0 || stationViewModel.LinkStationAndLineId <= 0)
            {
                return ("Todos os campos são obrigatórios.", StatusCodes.Status400BadRequest);
            }

            try
            {
                //stationViewModel.Created = DateTime.UtcNow;
                //stationViewModel.LastUpdated = DateTime.UtcNow;

                var result = await _stationViewRepository.Include(stationViewModel);
                return (result, StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                return (ex.Message ?? "Não foi possível salvar as alterações. Verifique se todos os itens estão cadastrados.",
                        StatusCodes.Status400BadRequest);
            }
        }
        public async Task<(object?, int)> FactoryView()
        {
            object? result;
            int statusCode;
            try
            {
                List<LineView> lineViews = new List<LineView>();
                List<StationViewModel> stationViewersAll = await _stationViewRepository.GetAllStationView();
                List<LinkStationAndLineModel> linksAll = await _linkRepository.GetAllLinks();
                List<LineModel> linesAll = await _lineRepository.GetAllLine();
                List<StationModel> stationAll = await _stationRepository.GetAllStation();
                List<MonitorEsdModel> monitoreAll = await _monitorEsdRepository.GetAllMonitor();
                lineViews.AddRange(linksAll.Select(link => new LineView()
                {
                    Line = new LineModel { ID = link.LineID },
                    Stations = linksAll.Where(x => x.LineID == link.LineID).OrderBy(k => k.OrdersList).Select(stationView => new StationView
                    {
                        Station = stationAll.Find(z => z.ID == stationView.StationID),
                        MonitorsEsd = stationViewersAll.Where(x => x.LinkStationAndLineId == link.ID).OrderBy(x => x.PositionSequence).Select(x => new MonitorEsdView
                        {
                            MonitorsEsd = monitoreAll.Find(y => y.ID == x.MonitorEsdId)

                        }).ToList(),

                    }).ToList(),
                }).OrderBy(j => j.Line.ID));

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
        public async Task<(object? Content, int StatusCode)> Delete(int id)
        {
            try
            {
                var stationView = await _stationViewRepository.GetByStationViewId(id);
                if (stationView == null)
                {
                    return ("Dados incorretos ou inválidos", StatusCodes.Status404NotFound);
                }

                var content = new
                {
                    stationView.ID,
                    stationView.MonitorEsdId,
                    stationView.LinkStationAndLineId
                };

                await _stationViewRepository.Delete(stationView.ID);
                return (content, StatusCodes.Status200OK);
            }
            catch (Exception ex)
            {

                return (ex.Message, StatusCodes.Status400BadRequest);
            }
        }



    }
}
