using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace BiometricFaceApi.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public ImageRepository(IOracleDataAccessRepository oracleConnector)
        {
            this.oraConnector = oracleConnector;
        }

        public async Task<List<ImageModel>> AllImage()
        {
            var result = await oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetAllImage, new { });

            return result;
        }
        public async Task<ImageModel> ImageForId(int id)
        {
            var result = await oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetImageById, new { id });
            return result.FirstOrDefault();

        }
        public async Task<ImageModel> ImageForUserId(int userId)
        {
            var result = await oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetUserId, new { userId });
            return result.FirstOrDefault();
        }
        public async Task<(bool, string)> AddImage(ImageModel data)
        {
            var result = (state: true, error: string.Empty);
            try
            {
                if (data != null)
                {
                    if (data.ImageFile == null)
                        throw new Exception("erro por imagem vazia");

                    await oraConnector.SaveData<ImageModel>(SQLScripts.InsertImage, data);
                    if (oraConnector.Error != null)
                        throw new Exception($"Error:{oraConnector.Error}");
                }
                else
                {
                    throw new Exception("erro por data vazia");
                }
               
                return result;
            }
            catch (Exception ex)
            {
                result = (state: false, error: ex.Message);
                return result;
            }

        }
        public async Task<ImageModel?> Update(ImageModel imageEntity)
        {
            ImageModel nextEntityImage = await ImageForUserId(imageEntity.UserId);
            if (nextEntityImage == null)
            {
                throw new Exception($"O usuário para o ID {imageEntity.UserId} não foi encontrado no banco de dados.");
            }
            nextEntityImage.PictureStream = imageEntity.PictureStream;
            await oraConnector.SaveData<ImageModel>(SQLScripts.UpdateImage, nextEntityImage);
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");

            return new ImageModel();
        }
        public async Task<bool> Delete(int id)
        {
            ImageModel delEntityImage = await ImageForId(id);
            if (delEntityImage == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<ImageModel>(SQLScripts.DeleteImage, delEntityImage);
            if (oraConnector.Error != null)
                throw new Exception($"Error:{oraConnector.Error}");
            return true;
        }


    }
}
