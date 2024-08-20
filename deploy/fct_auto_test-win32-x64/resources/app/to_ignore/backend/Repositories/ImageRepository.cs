using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace BiometricFaceApi.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public ImageRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }

        public async Task<List<ImageModel>> AllImage()
        {
            return await _dbContext.Images.ToListAsync();
        }
        public async Task<ImageModel> ImageForId(int idImage)
        {
            return await _dbContext.Images.FirstOrDefaultAsync(x => x.ID == idImage) ?? new ImageModel();
             
        }
        public async Task<ImageModel> ImageForUserId(int userId)
        {
            var result = await _dbContext.Images.FirstOrDefaultAsync(x => x.UserId == userId) ?? new ImageModel();
            return result;
        }
        public async Task<(bool, string)> AddImage(ImageModel data)
        {
            var result = (state: true, error: string.Empty);
            try
            {

                await _dbContext.Images.AddAsync(data);
                await _dbContext.SaveChangesAsync();
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

            _dbContext.Images.Update(nextEntityImage);
            await _dbContext.SaveChangesAsync();

            return _dbContext.Images.FirstOrDefault(image => image.ID == nextEntityImage.ID);
        }
        public async Task<bool> Delete(int id)
        {
            ImageModel delEntityImage = await ImageForId(id);
            if (delEntityImage == null)
            {
                throw new Exception($"O usuário para ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Images.Remove(delEntityImage);
            await _dbContext.SaveChangesAsync();
            return true;
        }


    }
}
