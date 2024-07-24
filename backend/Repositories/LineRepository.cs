using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Repositories
{
    public class LineRepository : ILineRepository
    {
        private readonly BiometricFaceDBContex _dbContext;

        public LineRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<LineModel>> GetAllLine()
        {
            return await _dbContext.lineModels.ToListAsync();
        }

        public async Task<LineModel> GetLineID(int id)
        {
            return await _dbContext.lineModels.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<LineModel?> GetLineName(string lineName)
        {
            return await _dbContext.lineModels.FirstOrDefaultAsync(x => x.Name == lineName);
        }

        public async Task<LineModel?> Include(LineModel lineModel)
        {
            LineModel? line = await GetLineID(lineModel.ID);
            if (line == null)
            {
                //include 
                await _dbContext.lineModels.AddAsync(lineModel);
                await _dbContext.SaveChangesAsync();
                line = await GetLineID(lineModel.ID);
            }
            else
            {
                //update
                line.ID = lineModel.ID;
                line.Name = lineModel.Name;
                _dbContext.lineModels.Update(line);
                await _dbContext.SaveChangesAsync();
            }
            return line;
        }

        public async Task<LineModel?> Delete(int id)
        {
            LineModel? line = await GetLineID(id);
            if (line == null)
            {
                throw new Exception($"Linha com ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext?.lineModels.Remove(line);
            await _dbContext.SaveChangesAsync();
            return line;
        }


    }
}
