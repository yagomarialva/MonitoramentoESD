using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;
using Mysqlx;
using Mysqlx.Expr;
using MySqlX.XDevAPI.Common;
using Org.BouncyCastle.Crypto.Operators;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections;
using System.Net;
using System.Runtime.InteropServices.ObjectiveC;

namespace BiometricFaceApi.Services
{
    public class BiometricService
    {

        protected readonly UserService _userService;
        protected readonly ImageService _imageService;

        public BiometricService(UserService userService, ImageService imageService)
        {
            _userService = userService;
            _imageService = imageService;

        }

        // Na mesma rota é possível atualizar e inserir operadores

        public async Task<(object?, int)> ManagerBiometric(BiometricModel biometric)
        {
            object? content;
            int statusCode;
            try
            {

                var user = new UserModel { Badge = biometric.Badge, Name = biometric.Name };
                var image = new ImageModel { ImageFile = biometric.Image };
                var repositoryUser = await _userService.GetUserByBadge(user.Badge);
                if (repositoryUser.Id > 0)
                {
                    // update
                    image.UserId = repositoryUser.Id;
                    await _userService.Update(user, repositoryUser.Id);
                    await _imageService.Update(image);
                    var updatedBiometric = new BiometricModel
                    {
                        Id = repositoryUser.Id,
                        Badge = biometric.Badge,
                        Name = biometric.Name,
                        Image = biometric.Image
                    };

                    content = updatedBiometric;
                    statusCode = StatusCodes.Status200OK;

                    return (content, statusCode);
                }
                else
                {
                    if (string.IsNullOrEmpty(user.Name))
                    {
                        throw new Exception("O nome do usuário não pode ser nulo");
                    }

                    if (string.IsNullOrEmpty(user.Badge))
                    {
                        throw new Exception("O identificador do usuário não pode ser nulo");
                    }

                    // include

                    user.Born = DateTime.Now;
                    var newUser = await _userService.Include(user);
                    if (newUser != null)
                    {
                        image.UserId = newUser.Id;
                        await _imageService.AddImage(image);
                        var includeBiometric = new BiometricModel
                        {
                            Id = newUser.Id,
                            Badge = biometric.Badge,
                            Name = biometric.Name,
                            Image = biometric.Image
                        };

                        content = includeBiometric;
                        statusCode = StatusCodes.Status201Created;
                        return (content, statusCode);
                    }
                    else
                    {
                        content = "Dados incorretos ou inválidos";
                        statusCode = StatusCodes.Status404NotFound;
                    }
                }
            }
            catch (Exception exception)
            {

                content = exception.Message;
                statusCode = StatusCodes.Status400BadRequest;
            }
            return (content, statusCode);
        }

        // Operador de pesquisa por ID
        public async Task<(object?, int)> GetUserById(int userID)
        {
            object? content;
            int statusCode;
            try
            {
                var respositoryUser = await _userService.GetUserById(userID);
                if (respositoryUser.Id > 0)
                {
                    var repositoryImage = await _imageService.GetImageByUserId(userID);
                    content = new
                    {
                        Id = repositoryImage.User.Id,
                        Name = repositoryImage.User.Name,
                        Badge = repositoryImage.User.Badge,
                        Image = repositoryImage.PictureStream
                    };
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

        // Delete operador por ID
        public async Task<(object?, int)> DelByUser(int userId)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryUser = await _userService.GetUserById(userId);
                if (repositoryUser.Id > 0)
                {
                    var repositoryImage = await _imageService.GetImageByUserId(userId);
                    if (repositoryImage != null)
                    {
                        await _imageService.Delete(repositoryImage.IdImage);
                    }
                    content = new
                    {
                        Id = repositoryUser.Id,
                        Name = repositoryUser.Name,
                        Badge = repositoryUser.Badge,
                        Image = repositoryImage?.PictureStream
                    };
                    await _userService.Delete(repositoryUser.Id);

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
        public async Task<ActionResult<List<UserModel>>> GetAllUsers()
        {
            List<UserModel> user = await _userService.GetAllUsers();
            return (user);
        }

    }
}
