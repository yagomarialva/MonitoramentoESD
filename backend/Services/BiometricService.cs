using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Writers;

using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections;
using System.Net;
using System.Runtime.InteropServices.ObjectiveC;
using static System.Net.Mime.MediaTypeNames;


namespace BiometricFaceApi.Services
{
    public class BiometricService
    {
        protected readonly UserService _userService;
        protected readonly ImageService _imageService;
        protected readonly ProduceActivityService _produceActivityService;

        public BiometricService(UserService userService, ImageService imageService, ProduceActivityService produceActivityService)
        {
            _userService = userService;
            _imageService = imageService;
            _produceActivityService = produceActivityService;
        }

        // Na rota ManagerOperator é possível atualizar e inserir operadores

        public async Task<(object?, int)> ManagerOperator(BiometricModel biometric)
        {
            object? content;
            int statusCode;
            try
            {

                var user = new UserModel { ID = biometric.ID, Badge = biometric.Badge, Name = biometric.Name };
                var image = new ImageModel { ImageFile = biometric.Image };
                var repositoryUser = await _userService.GetUserById(user.ID);
                if (repositoryUser != null)
                {
                    // update
                    image.UserId = repositoryUser.ID;

                    //update sem imagem 
                    if (image.UserId != null)
                    {
                        await _userService.Update(user, repositoryUser.ID);
                        var updatedBiometric = new BiometricModel
                        {
                            ID = repositoryUser.ID,
                            Badge = biometric.Badge,
                            Name = biometric.Name,
                            Stream = image.PictureStream

                        };

                        content = updatedBiometric;
                        statusCode = StatusCodes.Status200OK;

                        return (content, statusCode);
                    }
                    else 
                    {
                        //update com imagem
                        await _userService.Update(user, repositoryUser.ID);
                        var updatedBiometric = new BiometricModel
                        {
                            ID = repositoryUser.ID,
                            Badge = biometric.Badge,
                            Name = biometric.Name,
                            Stream = image.PictureStream

                        };
                        await _imageService.Update(image);
                        content = updatedBiometric;
                        statusCode = StatusCodes.Status200OK;
                        return (content, statusCode);
                    }
                   
                    
                    
                }
                else
                {
                    // include
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
                            Stream = image.PictureStream
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
        public async Task<BiometricModel> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user != null)
            {
                var image = await _imageService.GetImageByUserId(user.ID);
                var biometric = new BiometricModel
                {
                    ID = user.ID,
                    Name = user.Name,
                    Badge = user.Badge,
                    Stream = image?.PictureStream
                };
                return biometric;
            }
            else throw new Exception("badge invalido");

        }

        // buscar todos operadores
        public async Task<List<BiometricModel>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            var images = await _imageService.GetAllImages();
            var biometrics = users.Select(user =>
            {
                var image = images.Find(image => image.UserId == user.ID);
                return new BiometricModel
                {
                    ID = user.ID,
                    Badge = user.Badge,
                    Name = user.Name,
                    Stream = image?.PictureStream
                };
            });
            return biometrics.ToList();
        }

        //buscar opeadores pela matricula
        public async Task<BiometricModel> GetUserByBadger(string badge)
        {
            var user = await _userService.GetUserByBadge(badge);
            if (user != null)
            {
                var Image = await _imageService.GetImageByUserId(user.ID);
                var biometric = new BiometricModel
                {
                    ID = user.ID,
                    Name = user.Name,
                    Badge = user.Badge,
                    Stream = Image.PictureStream
                };
                return biometric;
            }
            else throw new Exception("badge invalido");
        }

        // Delete operador por ID
        public async Task<(object?, int)> DelByUser(int userId)
        {
            object? content;
            int statusCode;
            try
            {
                var repositoryUser = await _userService.GetUserById(userId);
                if (repositoryUser != null && repositoryUser.ID > 0)
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
                        // Base64Picture = repositoryImage.PictureStream != null ? Convert.ToBase64String(repositoryImage.PictureStream) : null
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
            catch (Exception )
            {

                content = "ID de Usuário Vinculado a Produção!";
                statusCode = StatusCodes.Status400BadRequest;
            }

            return (content, statusCode);
        }

    }
}
