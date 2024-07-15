using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Org.BouncyCastle.Bcpg;
using System;
using System.Data;

namespace BiometricFaceApi.Services
{
    public class RecordStatusService
    {
        private IRecordStatusRepository _repository;
        public RecordStatusService(IRecordStatusRepository repository)
        {

            _repository = repository;
        }

        public async Task<(object?, int)> GetAllStatus()
        {
            object? result;
            int statusCode;
            try
            {
                List<RecordStatusProduceModel> status = await _repository.GetAllRecordStatusProduces();
                if (!status.Any())
                {
                    throw new Exception("Nenhum status encontrado.");
                }
                result = status;
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
        public async Task<(object?, int)> GetByRecordStatusId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var statusId = await _repository.GetByRecordStatusId(id);
                if (statusId == null)
                {

                    result = "Dados incorretos ou inválidos";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = statusId;
                statusCode = StatusCodes.Status200OK;
                return (result, statusCode);
            }
            catch (Exception exeption)
            {

                result = exeption.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> Include(RecordStatusProduceModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? result;
            try
            {
                if (!string.IsNullOrEmpty(model.Description) & model.UserId == 0 & model.ProduceActivityId == 0)
                {
                    throw new Exception("Preencher campos obrigatórios.");
                }
                result = await _repository.Include(model);
            }
            catch (Exception execption)
            {
                
                result = execption.Message;
                statusCode = StatusCodes.Status400BadRequest;
                
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> Delete(int id ) 
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryRecordStatus = await _repository.GetByRecordStatusId(id);
                if (repositoryRecordStatus.Id > 0)
                {
                    content = new 
                    {
                        id = repositoryRecordStatus.Id,
                        produceActivityId = repositoryRecordStatus.ProduceActivityId,
                        userID = repositoryRecordStatus.UserId,
                        description = repositoryRecordStatus.Description,
                        
                    };

                    await _repository.Delete(repositoryRecordStatus.Id);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
                    statusCode = StatusCodes.Status400BadRequest;
                }
            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }
    }
}

