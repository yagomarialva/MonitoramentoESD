using BiometricFaceApi.Middleware;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class BraceletService
    {
        private IBraceletRepository repository;

        public BraceletService(IBraceletRepository repository)
        {
            this.repository = repository;
        }
        public async Task<List<BraceletModel>> GetAllBracelets()
        {
            return await repository.GetAllBracelets();
        }
        public async Task<BraceletModel> GetBraceletId(int id)
        {
            return await repository.GetByBraceletId(id);
        }
        public async Task<BraceletModel?> GetBraceletSn(string sn)
        {
            return await repository.GetByBreceletSn(sn);
        }
        public async Task<(object?, int)> Include(BraceletModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await repository.Include(model);
            }
            catch (Exception ex)
            {
                response = ex.Message;
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
                var repositoryBracelet = await repository.GetByBraceletId(id);
                if (repositoryBracelet.Id > 0)
                {
                    content = new
                    {
                        id = repositoryBracelet.Id,
                        sn = repositoryBracelet.Sn
                    };
                    await repository.Delete(repositoryBracelet.Id);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
                    statusCode = StatusCodes.Status404NotFound;
                }
            }
            catch (Exception ex)
            {
                content = ex.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (content, statusCode);
        }
    }
}
