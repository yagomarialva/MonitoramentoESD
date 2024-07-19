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
        public MonitorEsdService(IMonitorEsdRepository repository)
        {
            _repository = repository;
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
        public async Task<(object?, int)> GetPositionX(int x)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetPositionX(x);
                if (monitor == null)
                {

                    result = "Posição X não encontrado.";
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
        public async Task<(object?, int)> GetPositionY(int y)
        {
            object? result;
            int statusCode;
            try
            {
                var monitor = await _repository.GetPositionY(y);
                if (monitor == null)
                {

                    result = "Posição Y não encontrado.";
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
                if (monitorModel.PositionX == monitorModel.PositionY)
                {
                    response = "PosiçãoX não pode ser igual a PosiçãoY.";
                    statusCode = StatusCodes.Status400BadRequest;
                }
                else 
                {
                    bool exists = await _repository.PositionExistsAsync(monitorModel.PositionX, monitorModel.PositionY);
                    if (exists)
                    {
                        response = "A combinação já existe no bando de dados";
                        statusCode = StatusCodes.Status400BadRequest;
                    }
                    else
                    {
                        response = await _repository.Include(monitorModel);
                        statusCode = StatusCodes.Status200OK;
                    }
                }
                
                
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
                if (respositoryMonitor.Id > 0)
                {
                    content = new
                    {
                        id = respositoryMonitor.Id,
                        serialNumber = respositoryMonitor.SerialNumber,
                        description = respositoryMonitor.Description
                    };
                    await _repository.Delete(respositoryMonitor.Id);
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    throw new Exception("Dados incorretos ou inválidos.");
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
