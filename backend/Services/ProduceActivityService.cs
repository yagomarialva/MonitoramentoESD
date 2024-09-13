using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

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
        private IUsersRepository _usersRepository;
        private IJigRepository _jigRepository;
        private ILinkStationAndLineRepository _linkStationAndLineRepository;
        private IMonitorEsdRepository _monitorEsdRepository;

        public ProduceActivityService(IProduceActivityRepository repository, 
            IRecordStatusRepository recordStatusRepository, IAuthenticationRepository authenticationRepository, 
            IUsersRepository usersRepository, IJigRepository jigRepository, ILinkStationAndLineRepository linkStationAndLineRepository, IMonitorEsdRepository monitorEsdRepository)
        {
            _repository = repository;
            _recordStatusRepository = recordStatusRepository;
            _authenticationRepository = authenticationRepository;
            _usersRepository = usersRepository;
            _jigRepository = jigRepository;
            _linkStationAndLineRepository = linkStationAndLineRepository;
            _monitorEsdRepository = monitorEsdRepository;

        }
        public async Task<(object?, int)> GetAllProduceAct()
        {
            object? content;
            int statusCode;
            try
            {
                var produce = await _repository.GetAllProduceActivity();
                var jigs = await _jigRepository.GetAllJig();
                var monitores = await _monitorEsdRepository.GetAllMonitor();
                var user = await _usersRepository.GetAllUsers();
                var link = await _linkStationAndLineRepository.GetAllLinks();
                if (!produce.Any())
                {
                    content = "Nenhum Produção foi encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (content, statusCode);
                }
                else
                {
                    foreach (var prod in produce)
                    {
                        prod.User = user.Find(user=>user.ID == prod.UserId);
                        prod.Jig = jigs.Find(jig=>jig.ID ==prod.JigId);
                        prod.MonitorEsd = monitores.Find(monitor => monitor.ID == prod.MonitorEsdId);
                        prod.LinkStationAndLine = link.Find(link => link.ID == prod.LinkStationAnLineID);
                    }

                    content = produce;
                    statusCode = StatusCodes.Status200OK;
                }
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
                        var recordModel = new RecordStatusProduceModel { Description = description, ProduceActivityId = id, Status = status, DateEvent = DateAndTime.Now, UserId = user.ID };
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
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                if (produceModel.UserId == 0 & produceModel.JigId == 0 & produceModel.MonitorEsdId == 0)
                {
                    response = "Obrigatório Preencher todos os campos.";
                    statusCode = StatusCodes.Status400BadRequest;


                }
                else
                {
                    produceModel.DataTimeMonitorEsdEvent = DateTime.Now;
                    response = await _repository.Include(produceModel);
                }


            }
            catch (Exception)
            {
                response = "Verificar se todos os dados estão cadastrados.";
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
                var repositoryProduceActv = await _repository.GetByProduceActivityId(id);
                if (repositoryProduceActv != null)
                {
                    content = new
                    {
                        ID = repositoryProduceActv.ID,
                        UserId = repositoryProduceActv.UserId,
                        MonitorEsdId = repositoryProduceActv.MonitorEsdId,
                        JigId = repositoryProduceActv.JigId,
                        LinkStationAnLineID = repositoryProduceActv.LinkStationAnLineID
                    };
                    await _repository.Delete(repositoryProduceActv.ID);
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
