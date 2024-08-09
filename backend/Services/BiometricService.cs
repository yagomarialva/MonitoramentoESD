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
using Org.BouncyCastle.Security;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections;
using System.Net;
using System.Runtime.InteropServices.ObjectiveC;
using ZstdSharp.Unsafe;

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

        // Na rota ManagerOperator é possível atualizar e inserir operadores

        public async Task<(object?, int)> ManagerOperator(BiometricModel biometric)
        {
            object? content;
            int statusCode;
            try
            {

                var user = new UserModel { Badge = biometric.Badge, Name = biometric.Name};
                var image = new ImageModel { ImageFile = biometric.Image };
                var repositoryUser = await _userService.GetUserByBadge(user.Badge);
                if (repositoryUser.ID > 0)
                {
                    // update
                    image.UserId = repositoryUser.ID;
                    await _userService.Update(user, repositoryUser.ID);
                    await _imageService.Update(image);
                    var updatedBiometric = new BiometricModel
                    {
                        ID = repositoryUser.ID,
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
                    // include
                    user.Born = DateTime.Now;
                    var newUser = await _userService.Include(user);
                    if (newUser != null)
                    {
                        image.UserId = newUser.ID;
                        await _imageService.AddImage(image);
                        var includeBiometric = new BiometricModel
                        {
                            ID = newUser.ID,
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
                        content = "Dados incorretos ou inválidos.";
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
                if (respositoryUser.ID > 0)
                {
                    var repositoryImage = await _imageService.GetImageByUserId(userID);
                    content = new
                    {
                        ID = repositoryImage.User.ID,
                        Name = repositoryImage.User.Name,
                        Badge = repositoryImage.User.Badge,
                        Image = repositoryImage.PictureStream
                    };
                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
                    statusCode = StatusCodes.Status404NotFound;
                }
            }
            catch (Exception execption)
            {

                content = execption.Message;
                statusCode = StatusCodes.Status500InternalServerError;
            }
            return (content, statusCode);
        }
        
        // buscar todos operadores
        public async Task<List<UserModel>> GetAllUsers()
        {
            var user = await _userService.GetAllUsers();
            return user;
        }

        //buscar opeadores pela matricula
        public async Task<UserModel> GetUserByBadger(string badge)
        {
            var user = await _userService.GetUserByBadge(badge);
            return user;
        }

        // Delete operador por ID
        public async Task<(object?, int)> DelByUser(int userId)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryUser = await _userService.GetUserById(userId);
                if (repositoryUser.ID > 0)
                {
                    var repositoryImage = await _imageService.GetImageByUserId(userId);
                    if (repositoryImage != null)
                    {
                        await _imageService.Delete(repositoryImage.ID);
                    }
                    content = new
                    {
                        ID = repositoryUser.ID,
                        Name = repositoryUser.Name,
                        Badge = repositoryUser.Badge,
                        Image = repositoryImage?.PictureStream
                    };
                    await _userService.Delete(repositoryUser.ID);

                    statusCode = StatusCodes.Status200OK;
                }
                else
                {
                    content = "Dados incorretos ou inválidos.";
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
