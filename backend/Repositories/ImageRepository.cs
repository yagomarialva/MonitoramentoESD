using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;


namespace BiometricFaceApi.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly IOracleDataAccessRepository _oraConnector;
        public ImageRepository(IOracleDataAccessRepository oracleConnector)
        {
            _oraConnector = oracleConnector;
        }
        public async Task<List<ImageModel?>> GetAllImagesAsync()
        {
            var result = await _oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetAllImage, new { });
            return result;
        }
        public async Task<List<ImageModel?>> GetListImagesAsync(int page, int pageSize)
        {
            var result = await _oraConnector.LoadData<ImageModel?, dynamic>(SQLScripts.GetListImage,
                new { Offset = (page - 1) * pageSize, Limit = pageSize });
            return result.ToList() ?? throw new KeyNotFoundException($"Nenhuma image cadastrado.");
        }
        public async Task<ImageModel?> GetImageByIdAsync(int id)
        {
            var result = await _oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetImageById, new { id });
            return result.FirstOrDefault();


        }
        public async Task<ImageModel?> GetImageByUserIdAsync(int userId)
        {
            var result = await _oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetUserId, new { userId });
            return result.FirstOrDefault();
        }
        public async Task<ImageModel?> GetByImageAsync(string img)
        {
            var result = await _oraConnector.LoadData<ImageModel, dynamic>(SQLScripts.GetImageByString, new {img});
            return result.FirstOrDefault();
        }
        public async Task<ImageModel?> AddImageAsync(ImageModel image)
        {
            try
            {
                image.Created = DateTimeHelperService.GetManausCurrentDateTime();
                image.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                await _oraConnector.SaveData<ImageModel>(SQLScripts.InsertImage, image);
                if (_oraConnector.Error != null)
                {
                    throw new Exception($"Erro de banco de dados: {_oraConnector.Error}");
                }

                return image;
            }
            catch (Exception ex )
            {
                throw new Exception("Falha ao tentar adicionar imagem.", ex);
            }
        }
        public async Task<ImageModel?> UpdateImageAsync(ImageModel imageEntity)
        {
            ImageModel? nextEntityImage = await GetImageByUserIdAsync(imageEntity.UserId);
            if (nextEntityImage == null)
            {
                throw new Exception($"O imagem do usuário para o ID {imageEntity.UserId} não foi encontrado no banco de dados.");
            }
            nextEntityImage.PictureStream = imageEntity.PictureStream;
            nextEntityImage.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
            await _oraConnector.SaveData<ImageModel>(SQLScripts.UpdateImage, nextEntityImage);
            if (_oraConnector.Error != null)
                throw new Exception($"Error:{_oraConnector.Error}");
           
            return await GetImageByUserIdAsync(imageEntity.UserId);

        }
        public async Task<bool> DeleteImageAsync(int imageId)
        {
            var existingImage = await GetImageByIdAsync(imageId);
            if (existingImage == null)
            {
                throw new KeyNotFoundException($"Nenhuma imagem encontrada para ID {imageId}");
            }

            await _oraConnector.SaveData<ImageModel>(SQLScripts.DeleteImage, existingImage);
            if (_oraConnector.Error != null)
            {
                throw new Exception($"Erro de banco de dados: {_oraConnector.Error}");
            }

            return true;
        }

        

        public class OperationResult
        {
            public bool IsSuccess { get; }
            public string Message { get; }

            private OperationResult(bool isSuccess, string message)
            {
                IsSuccess = isSuccess;
                Message = message;
            }

            public static OperationResult Success() => new OperationResult(true, string.Empty);

            public static OperationResult Failure(string message) => new OperationResult(false, message);
        }


    }
}
