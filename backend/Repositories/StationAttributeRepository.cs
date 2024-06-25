using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class StationAttributeRepository : IStationAttributeRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public StationAttributeRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<StationAttributeModel>> GetAllStationAtt()
        {
            return await _dbContext.StationsAttrib.ToListAsync();
        }
        public async Task<StationAttributeModel> GetByAttribId(int id)
        {
            return await _dbContext.StationsAttrib.FirstOrDefaultAsync(x => x.Id == id) ?? new StationAttributeModel();
        }
        public async Task<StationAttributeModel> GetByStationId(int stationId)
        {
            return await _dbContext.StationsAttrib.FirstOrDefaultAsync(x => x.StationId == stationId) ?? new StationAttributeModel();
        }
        public async Task<StationAttributeModel?> GetByPropertyName(string propertyName)
        {
            return await _dbContext.StationsAttrib.FirstOrDefaultAsync(x => x.Property == propertyName);
        }
        // Task realiza o include e update, include caso nao haja dados cadastrados no banco e update caso o estação ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationAttributeModel> Include(StationAttributeModel stationAtt)
        {
            if (stationAtt == null)
            {
                throw new ArgumentNullException("Atributo não pode ser nulo.");
            }
            StationAttributeModel? attributeModelUp = await GetByAttribId(stationAtt.Id);
            if (stationAtt == null)
            {
                // include
                await _dbContext.StationsAttrib.AddAsync(stationAtt);
                await _dbContext.SaveChangesAsync();

                var savedAttribute = _dbContext.StationsAttrib.FirstOrDefault(newAttribute => newAttribute.Id == stationAtt.Id);
                stationAtt.Id = savedAttribute.Id;
            }
            else
            {
                // update 
                var update = await _dbContext.StationsAttrib.AsNoTracking().FirstOrDefaultAsync(x => x.Id == stationAtt.Id);
                stationAtt.Id = attributeModelUp.Id;
                attributeModelUp = stationAtt;
                await _dbContext.AddAsync(stationAtt);
                await _dbContext.SaveChangesAsync();
            }

            return stationAtt;
        }
        public async Task<StationAttributeModel> Delete(int id)
        {
            StationAttributeModel stationAttributeModelDel = await GetByAttribId(id);
            if (stationAttributeModelDel == null)
            {
                throw new Exception($"Atributo com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.StationsAttrib.Remove(stationAttributeModelDel);
            await _dbContext.SaveChangesAsync();
            return stationAttributeModelDel;
        }
    }
}
