﻿using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;

namespace BiometricFaceApi.Services
{
    public class JigService
    {
        private IJigRepository _repository;

        public JigService(IJigRepository repository)
        {
            _repository = repository;

        }
        public async Task<(object?, int)> GetAllJigs()
        {
            object? result;
            int statusCode;
            try
            {
                List<JigModel> jigs = await _repository.GetAllJig();
                if (!jigs.Any())
                {
                    result = ("Nenhum Jig cadastrado.");
                    statusCode = StatusCodes.Status404NotFound;
                }
                else
                {
                    result = jigs;
                    statusCode = StatusCodes.Status200OK;
                    return (result, statusCode);
                }

            }
            catch (Exception exeption)
            {

                result = exeption.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (result, statusCode);
        }
        public async Task<(object?, int)> GetJigId(int id)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByJigId(id);
                if (station == null)
                {
                    result = ("Jig Id não encontrado.");
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = station;
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
        public async Task<(object?, int)> GetName(string name)
        {
            object? result;
            int statusCode;
            try
            {
                var station = await _repository.GetByName(name);
                if (station == null)
                {
                    result = ("Jig Id não encontrado.");
                    statusCode = StatusCodes.Status404NotFound;
                }
                result = station;
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
        public async Task<(object?, int)> Include(JigModel model)
        {
            var statusCode = StatusCodes.Status200OK;
            object? response;
            try
            {

                response = await _repository.Include(model);
                statusCode = StatusCodes.Status200OK;
            }
            catch (Exception exception)
            {
                response = exception.Message;
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
                var repositorStation = await _repository.GetByJigId(id);
                if (repositorStation.ID > 0)
                {
                    content = new
                    {
                        id = repositorStation.ID,
                        name = repositorStation.Name,


                    };
                    await _repository.Delete(repositorStation.ID);

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
