using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Org.BouncyCastle.Asn1.Ocsp;
using Pomelo.EntityFrameworkCore.MySql.Metadata.Internal;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

namespace BiometricFaceApi.Services
{
    public class ProduceActivityService
    {
        private IProduceActivityRepository _repository;
        private IRecordStatusRepository _recordStatusRepository;
        private IAuthenticationRepository _authenticationRepository;
        public ProduceActivityService(IProduceActivityRepository repository, IRecordStatusRepository recordStatusRepository, IAuthenticationRepository authenticationRepository)
        {
            _repository = repository;
            _recordStatusRepository = recordStatusRepository;
            _authenticationRepository = authenticationRepository;
           

        }
        public async Task<(object?, int)> GetAllProduceAct()
        {
            object? content;
            int statusCode;
            try
            {
                List<ProduceActivityModel> monitor = await _repository.GetAllProduceActivity();
                var prod = new ProduceActivityModel {};
               
                if (!monitor.Any())
                {
                    content = "Nenhum Producção foi encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (content, statusCode);
                }
                content = monitor;
                statusCode = StatusCodes.Status200OK;
                return (content, statusCode);

            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                return (content, statusCode);
            }

        }
        public async Task<(object?, int)> GetProduceId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetByProduceActivityId(id);
                if (monitor == null)
                {
                    result = "Produção não encontrado.";
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
        public async Task<ProduceActivityModel?> GetProduceMonitorId(int monitorProduce)
        {
            return await _repository.GetByProduceMonitorId(monitorProduce);
        }
        public async Task<ProduceActivityModel?> GetProduceJigId(int jigProduce)
        {
            return await _repository.GetByProduceJigId(jigProduce);
        }
        public async Task<ProduceActivityModel?> GetProduceUserId(int userProduce)
        {
            return await _repository.GetByProduceUserId(userProduce);
        }

        public async Task<(object?, int)> ChangeStatus(int id, bool status, string? description, string jwt)
        {
            object? result;
            int statusCode;
            try
            {
                var repositoryStatus = await _repository.GetByProduceActivityId(id);
                if (status && string.IsNullOrEmpty(description))
                {
                    throw new Exception("Por favor informar o motivo da inativação.");

                }
                else
                {
                    // save in recordhistory
                    var payload = new JwtSecurityTokenHandler().ReadJwtToken(jwt);
                    var claim = payload.Claims.Where(c => c.Type == ClaimTypes.Name);
                    if (claim.Any())
                    {
                        var user = await _authenticationRepository.AuthGetByUsername(claim.FirstOrDefault().Value);
                        var recordModel = new RecordStatusProduceModel { Description = description, ProduceActivityId = id,Status = status, DateEvent = DateAndTime.Now, UserId = user.Id };
                        result = await _repository.Islocked(id, status);
                        await _recordStatusRepository.Include(recordModel);
                        statusCode = StatusCodes.Status200OK;
                    }
                    else throw new Exception("Usuário inválido.");

                    return (result, statusCode);
                }


            }
            catch (Exception exception)
            {

                result = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
                return (result, statusCode);
            }

        }
        public async Task<(object?, int)> Include(ProduceActivityModel produceModel)
        {
            object? content;
            int statusCode;
            try
            {
                var user = new UserModel { Id = produceModel.UserId, Name = produceModel.UserName };
                var monitor = new MonitorEsdModel { Id = produceModel.MonitorEsdId, SerialNumber = produceModel.MonitorEsdSn };
                var jig = new JigModel { Id = produceModel.JigId, Name = produceModel.JigName };
                var station = new StationModel { Id = produceModel.StationId, Name = produceModel.StationName };

                if (produceModel.UserId == 0 & produceModel.JigId == 0 & produceModel.MonitorEsdId == 0)
                {
                    throw new Exception("Todos os campos são obrigatórios.");
                }

                produceModel.DataTimeMonitorEsdEvent = DateTime.Now;
                var newProd = await _repository.Include(produceModel);
                if (newProd != null)
                {

                    user.Id = newProd.Id;
                    user.Name = newProd.UserName;
                    monitor.Id = newProd.MonitorEsdId;
                    monitor.SerialNumber = newProd.MonitorEsdSn;
                    jig.Id = newProd.JigId;
                    jig.Name = newProd.JigName;
                    station.Id = newProd.StationId;
                    station.Name = newProd.StationName;

                    var include = new ProduceActivityModel
                    {
                        Id = newProd.Id,
                        UserId = produceModel.UserId,
                        UserName = produceModel.UserName,
                        MonitorEsdId = produceModel.MonitorEsdId,
                        MonitorEsdSn = produceModel.MonitorEsdSn,
                        JigId = produceModel.JigId,
                        JigName = produceModel.JigName,
                        StationId = produceModel.StationId,
                        StationName = produceModel.StationName
                    };
                    content = include;
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
                    statusCode = StatusCodes.Status404NotFound;
                }

            }
            catch (Exception)
            {
                content = "Não foi possível salvar as alterações. Verifique se todos os itens estão cadastrados.";

                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }

        public async Task<(object?, int)> Delete(int id)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryProduceActv = await _repository.GetByProduceActivityId(id);
                if (repositoryProduceActv != null)
                {
                    content = new
                    {
                        Id = repositoryProduceActv.Id,
                        UserId = repositoryProduceActv.UserId,
                        MonitorEsdId = repositoryProduceActv.MonitorEsdId,
                        JigId = repositoryProduceActv.JigId,
                        StationId = repositoryProduceActv.StationId
                    };
                    await _repository.Delete(repositoryProduceActv.Id);
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
