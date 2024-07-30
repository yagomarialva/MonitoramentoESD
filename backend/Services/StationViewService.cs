using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class StationViewService
    {
        
        protected readonly IStationViewRepository _stationViewRepository;
        protected readonly IMonitorEsdRepository _monitorEsdRepository;
        protected readonly ILinkStationAndLineRepository _linkRepository;

        public StationViewService(IStationViewRepository stationViewRepository, IMonitorEsdRepository monitorEsdRepository, ILinkStationAndLineRepository linkStationAndLineRepository)
        {
            
            _stationViewRepository = stationViewRepository;
            _monitorEsdRepository = monitorEsdRepository;
            _linkRepository = linkStationAndLineRepository;
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
            catch (Exception)
            {
                result = "Não foi possível salvar as alterações. Verifique se todos os itens estão cadastrados.";

                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);
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
