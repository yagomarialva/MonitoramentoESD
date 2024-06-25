using AutoMapper;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Services
{
    public class BraceletManagerService
    {
        private readonly BraceletRepository _bracelet;
        private readonly BraceletAttributeRepository _attBracelet;
        

        public BraceletManagerService(BraceletRepository bracelet, BraceletAttributeRepository attBracelet)
        {
            _bracelet = bracelet;
            _attBracelet = attBracelet;
            
        }

        public async Task<(Object?, int)> ManagerBracelet(BraceletManagerModel manager)
        {
            object? content;
            int statusCode;
            try
            {

                var existingBracelet = await _bracelet.GetByBreceletSn(manager.Sn);
                var attibute = new BraceletAttributeModel { Property = manager.Property, Value = manager.Value };
                if (existingBracelet != null && existingBracelet.Id > 0)
                {
                    // update

                    manager.Id = existingBracelet.Id;
                    await _bracelet.Include(existingBracelet);
                    await _attBracelet.Include(attibute);
                    var update = new BraceletManagerModel
                    {
                        Id = manager.Id,
                        Sn = manager.Sn,
                        Property = manager.Property,
                        Value = manager.Value
                    };
                    content = update;
                    statusCode = StatusCodes.Status200OK;
                    return (content, statusCode);
                }
                else
                {
                    if (string.IsNullOrEmpty(manager.Sn))
                    {
                        throw new Exception("O Sn não pode ser nulo.");
                    }

                    // include 
                    var newBracelet = await _bracelet.Include(existingBracelet);
                    if (newBracelet != null && newBracelet.Id > 0)
                    {
                        manager.Id = newBracelet.Id;
                        await _bracelet.Include(newBracelet);
                        var include = new BraceletManagerModel
                        {
                            Id = manager.Id,
                            Sn = manager.Sn,
                            Property = manager.Property,
                            Value = manager.Value
                        };
                        content = include;
                        statusCode = StatusCodes.Status201Created;
                    }
                    else
                    {
                        content = "Dados incorretos ou inválidos";
                        statusCode = StatusCodes.Status404NotFound;
                    }
                }
            }
            catch (Exception execption)
            {
                content = execption.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }

    }
}
