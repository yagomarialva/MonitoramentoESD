using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class StationViewService
    {
        
        protected readonly IStationViewRepository _stationViewRepository;
        protected readonly IJigRepository _jigRepository;
        protected readonly IStationRepository _stationRepository;

        public StationViewService(IStationViewRepository stationViewRepository, IJigRepository jigRepository, IStationRepository stationRepository)
        {
            
            _stationViewRepository = stationViewRepository;
            _jigRepository = jigRepository;
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
                    result = "Nenhuma Linha de Producção foi encontrado.";
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
        public async Task<(object?, int)> GetStationViewId(int id)
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
        public async Task<(object?, int)> GetJigId(int id)
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
        public async Task<(object?, int)> GetByStationProductionId(int id)
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
                if (stationViewModel.JigId == 0 & stationViewModel.StationId == 0)
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
        public async Task<(object?, int)> Delete(int id)
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
                        Id = repositoryStationViewDel.Id,
                        JigId = repositoryStationViewDel.JigId,
                        StationId = repositoryStationViewDel.StationId

                    };
                    await _stationViewRepository.Delete(repositoryStationViewDel.Id);
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
