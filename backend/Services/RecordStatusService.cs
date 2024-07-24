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
                    result = "Nenhum status encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    result = status;
                    statusCode = StatusCodes.Status200OK;
                }
                return (result, statusCode);
            }
            catch (Exception)
            {

                result = "Falha de requisição";
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
                if (repositoryRecordStatus.ID > 0)
                {
                    content = new 
                    {
                        id = repositoryRecordStatus.ID,
                        produceActivityId = repositoryRecordStatus.ProduceActivityId,
                        userID = repositoryRecordStatus.UserId,
                        description = repositoryRecordStatus.Description,
                        
                    };

                    await _repository.Delete(repositoryRecordStatus.ID);
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

