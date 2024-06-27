using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class BraceletAttributeRepository : IBraceletAttributeRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public BraceletAttributeRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<BraceletAttributeModel>> GetAllBraceletsAtt()
        {
            return await _dbContext.BraceletAttrib.ToListAsync();
        }

        public async Task<BraceletAttributeModel> GetByAttribId(int id)
        {
            return await _dbContext.BraceletAttrib.FirstOrDefaultAsync(x => x.AttributeId == id) ?? new BraceletAttributeModel();
        }

        public async Task<BraceletAttributeModel> GetByBraceletId(int id)
        {
            return await _dbContext.BraceletAttrib.FirstOrDefaultAsync(x => x.BraceletId == id) ?? new BraceletAttributeModel();
        }

        public async Task<BraceletAttributeModel?> GetByPropertyName(string? propertyName)
        {
            return await _dbContext.BraceletAttrib.FirstOrDefaultAsync(x => x.Property == propertyName);
        }
        // Task realiza o include e update, include caso nao haja dados cadastrados no banco e update caso o bracelet ja 
        // tenha alguma propriedade cadastrada.
        public async Task<BraceletAttributeModel?> Include(BraceletAttributeModel braceletAtt)
        {
            await _dbContext.BraceletAttrib.AddAsync(braceletAtt);
            await _dbContext.SaveChangesAsync();
            var result = await _dbContext.BraceletAttrib.FirstOrDefaultAsync(x => x.AttributeId == braceletAtt.AttributeId);
            return result;
        }

        public async Task<BraceletAttributeModel> Update(BraceletAttributeModel bracelet, int id)
        {
            BraceletAttributeModel braceletAttriUp = await GetByBraceletId(id);

            if (braceletAttriUp == null)
            {
                throw new Exception($"O bracelet para ID:{id} não foi encontrado no banco de dados.");
            }
            var update = await _dbContext.BraceletAttrib.AsNoTracking().FirstOrDefaultAsync(x => x.AttributeId == braceletAttriUp.AttributeId);
            braceletAttriUp.Property = braceletAttriUp.Property;
            braceletAttriUp.Value = braceletAttriUp.Value;
            _dbContext.BraceletAttrib.Update(braceletAttriUp);
            await _dbContext.SaveChangesAsync();
            return braceletAttriUp;
        }
        public async Task<BraceletAttributeModel> Delete(int id)
        {
            BraceletAttributeModel braceletAttributeModelDel = await GetByAttribId(id);
            if (braceletAttributeModelDel == null)
            {
                throw new Exception($"Atributo com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.BraceletAttrib.Remove(braceletAttributeModelDel);
            await _dbContext.SaveChangesAsync();
            return braceletAttributeModelDel;
        }


    }
}
