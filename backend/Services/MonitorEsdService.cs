using AutoMapper.Internal.Mappers;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Runtime.InteropServices.ObjectiveC;
using static System.Net.Mime.MediaTypeNames;

namespace BiometricFaceApi.Services
{
    public class MonitorEsdService
    {
        private IMonitorEsdRepository _repository;
        private IPositionRepository _positionRepository;
        public MonitorEsdService(IMonitorEsdRepository repository, IPositionRepository positionRepository)
        {
            _repository = repository;
            _positionRepository = positionRepository;
        }
        public async Task<(object?, int)> GetAllMonitorEsds()
        {
            object? result;
            int statusCode;
            try
            {
                List<MonitorEsdModel> monitor = await _repository.GetAllMonitor();
                if (!monitor.Any())
                {
                    result = "Nenhum monitor cadastrado.";
                    statusCode = StatusCodes.Status404NotFound;
                    return (result, statusCode);
                }
                else
                {
                    
                    result = monitor;
                    statusCode = StatusCodes.Status200OK;
                }
                return (result, statusCode);

            }
            catch (Exception exception)
            {

                result = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);

        }
        public async Task<(object?, int)> GetMonitorId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetByMonitorId(id);
                if (monitor == null)
                {

                    result = "Monitor Id não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = monitor;
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
        public async Task<(object?, int)> GetUserId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetUserId(id);
                if (monitor == null)
                {

                    result = "Usuário ID não encontrado.";
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = monitor;
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
        public async Task<(object?, int)> Include(MonitorEsdModel monitorModel)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {
                response = await _repository.Include(monitorModel);
                statusCode = StatusCodes.Status201Created;
            }
            catch (Exception)
            {
                response = "Verifique se todos os Dados estão cadastrados na Base de Dados";
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
                var respositoryMonitor = await _repository.GetByMonitorId(id);
                if (respositoryMonitor.ID > 0)
                {
                    content = new
                    {
                        id = respositoryMonitor.ID,
                        serialNumber = respositoryMonitor.SerialNumber,
                        positionId = respositoryMonitor.PositionId,
                        positionSeguence = respositoryMonitor.PositionSequence,
                        status = respositoryMonitor.Status,
                        description = respositoryMonitor.Description
                    };
                    await _repository.Delete(respositoryMonitor.ID);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    throw new Exception("Dados incorretos ou inválidos.");
                }
            }
            catch (Exception)
            {

                content = $"{id} não encontrado.";
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }

    }
}
