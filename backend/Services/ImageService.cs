using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.VisualBasic;

namespace BiometricFaceApi.Services
{
    public class ImageService
    {
        private IImageRepository images;

        public ImageService(IImageRepository images)
        {
            this.images = images;
        }

        public async Task<List<ImageModel>> GetAllImages()
        {
            return await images.AllImage();
        }
        public async Task<ImageModel> GetImageById(int idImage)
        {
            return await images.ImageForId(idImage);
        }
        public async Task<ImageModel> GetImageByUserId(int userId)
        {
            return await images.ImageForUserId(userId);
        }
        public async Task<(bool, string)> AddImage(ImageModel PictureStream)
        {
            return await images.AddImage(PictureStream);
        }
        public async Task<ImageModel?> Update(ImageModel imageEntity)
        {
            return await images.Update(imageEntity);
        }
        public async Task<bool> Delete(int id)
        {
            return await images.Delete(id);
        }
    }
}
