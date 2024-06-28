using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using System;

namespace BiometricFaceApi.Services
{
    public class BraceletAttributeService
    {
        private IBraceletAttributeRepository repository;
        public BraceletAttributeService(IBraceletAttributeRepository repository)
        {
            this.repository = repository;
        }

        public async Task<List<BraceletAttributeModel>> GetAllAttributes()
        {
            List<BraceletAttributeModel> bracelet = await repository.GetAllBraceletsAtt();
            return bracelet;
        }
        public async Task<BraceletAttributeModel> GetByAttibeById(int id)
        {
            return await repository.GetByAttribId(id);
        }
        public async Task<BraceletAttributeModel?> GetByPropertyName(string name)
        {
            return await repository.GetByPropertyName(name);
        }
        public async Task<BraceletAttributeModel> Include(BraceletAttributeModel model)
        {
            return await repository.Include(model);
        }
        public async Task<BraceletAttributeModel> Update(BraceletAttributeModel model, int id)
        {
            return await repository.Update(model, id);
        }
        public async Task<(object?, int)> Delete(int id)
        {
            object? content;
            int statusCode;

            try
            {
                var repositorybracelet = await repository.GetByAttribId(id);
                if (repositorybracelet.AttributeId > 0)
                {
                    content = new
                    {
                        id = repositorybracelet.AttributeId,
                        braletId = repositorybracelet.BraceletId,
                        property = repositorybracelet.Property,
                        value = repositorybracelet.Value
                    };
                    await repository.Delete(repositorybracelet.AttributeId);
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