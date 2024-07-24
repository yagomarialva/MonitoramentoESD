using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class PositionRepository : IPositionRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public PositionRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }

        public async Task<List<PositionModel>> GetAllPositions()
        {
            return await _dbContext.Position.ToListAsync();
        }

        public async Task<PositionModel?> GetPositionId(int id)
        {
            return await _dbContext.Position.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<PositionModel?> GetSizeX(int sizeX)
        {
            return await _dbContext.Position.FirstOrDefaultAsync(x => x.SizeX == sizeX);
        }

        public async Task<PositionModel?> GetSizeY(int sizeY)
        {
            return await _dbContext.Position.FirstOrDefaultAsync(x => x.SizeY == sizeY);
        }

        public async Task<PositionModel?> Include(PositionModel positionModel)
        {
            PositionModel? position = await GetPositionId(positionModel.ID);
            if (position == null)
            {
                //include 
                await _dbContext.Position.AddAsync(positionModel);
                await _dbContext.SaveChangesAsync();
                position = await GetPositionId(positionModel.ID);
            }
            else
            {
                position.ID = positionModel.ID;
                position.SizeX = positionModel.SizeX;
                position.SizeY = positionModel.SizeY;
                _dbContext.Position.Update(position);
                await _dbContext.SaveChangesAsync();
            }
            return position;
        }
        public async Task<PositionModel?> Delete(int id)
        {
           PositionModel? position = await GetPositionId(id);
            if (position == null)
            {
                throw new Exception($"Posiç]ao com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.Position.Remove(position);
            await _dbContext.SaveChangesAsync();
            return position;
        }
    }
}
