using BiometricFaceApi.Models;

namespace BiometricFaceApi.Repositories.Interfaces
{
    public interface IImageRepository
    {
        Task<List<ImageModel>> AllImage();
        Task<ImageModel> ImageForId(int idImage);
        Task<ImageModel> ImageForUserId(int userId);
        Task<(bool, string)> AddImage(ImageModel PictureStream);
        Task<ImageModel?> Update(ImageModel imageEntity);
        Task<bool> Delete(int id);
    }
}
