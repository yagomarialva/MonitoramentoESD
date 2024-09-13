using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.VisualBasic;

namespace BiometricFaceApi.Services
{
    public class ImageService
    {
        private IImageRepository _images;

        public ImageService(IImageRepository images)
        {
            _images = images;
        }

        public async Task<List<ImageModel>> GetAllImages()
        {
            return await _images.AllImage();
        }
        public async Task<ImageModel> GetImageById(int idImage)
        {
            return await _images.ImageForId(idImage);
        }
        public async Task<ImageModel> GetImageByUserId(int userId)
        {
            return await _images.ImageForUserId(userId);
        }
        public async Task<(bool, string)> AddImage(ImageModel PictureStream)
        {
            return await _images.AddImage(PictureStream);
        }
        public async Task<ImageModel?> Update(ImageModel imageEntity)
        {
            return await _images.Update(imageEntity);
        }
        public async Task<bool> Delete(int id)
        {
            return await _images.Delete(id);
        }
    }
}
