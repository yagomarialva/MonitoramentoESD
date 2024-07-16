using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class LineViewService
    {
       // protected readonly IJigRepository _jigrepository;
       //protected readonly ILineProductionRepository _lineProduction;
        protected readonly ILineViewRepository _lineViewRepository;

        public LineViewService(/*IJigRepository jigRepository, ILineProductionRepository lineProductionRepository,*/ ILineViewRepository lineViewRepository)
        {
            //_jigrepository = jigRepository;
            //_lineProduction = lineProductionRepository;
            _lineViewRepository = lineViewRepository;
        }
        public async Task<(object?, int)> GetAllLineView()
        {
            object? result;
            int statusCode;
            try
            {
                List<LineViewModel> lineView = await _lineViewRepository.GetAllLineView();
                if (!lineView.Any())
                {
                    result = "Nenhuma Linha de Producção foi encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                result = lineView;
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

        public async Task<(object?, int)> GetLineViewId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _lineViewRepository.GetByLineViewId(id);
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
                var monitor = await _lineViewRepository.GetByJigId(id);
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
        public async Task<(object?, int)> GetLineProduction(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _lineViewRepository.GetByLineProductionId(id);
                if (monitor == null)
                {
                    result = "Linha de Produção não encontrado.";
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

        public async Task<(object?, int)> Include(LineViewModel lineViewNodel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? result;
            try
            {
                if (lineViewNodel.JigId == 0 & lineViewNodel.LineId == 0)
                {
                    throw new Exception("Todos os campos são obrigatórios.");
                }
                lineViewNodel.Created = DateTime.Now;
                result = await _lineViewRepository.Include(lineViewNodel);
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
                var repositoryLineViewDel = await _lineViewRepository.GetByLineViewId(id);
                if (repositoryLineViewDel != null)
                {
                    content = new
                    {
                        Id = repositoryLineViewDel.Id,
                        LineId = repositoryLineViewDel.LineId,
                        JigId = repositoryLineViewDel.JigId,

                    };
                    await _lineViewRepository.Delete(repositoryLineViewDel.Id);
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
