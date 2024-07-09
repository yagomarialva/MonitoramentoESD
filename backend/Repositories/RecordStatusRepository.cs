using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Repositories
{
    public class RecordStatusRepository : IRecordStatusRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public RecordStatusRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<RecordStatusProduceModel>> GetAllRecordStatusProduces()
        {
            return await _dbContext.RecordStatusProduce.ToListAsync();
        }

        public async Task<RecordStatusProduceModel?> GetByRecordStatusId(int id)
        {
            return await _dbContext.RecordStatusProduce.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<RecordStatusProduceModel?> GetByProduceActvId(int id)
        {
            return await _dbContext.RecordStatusProduce.FirstOrDefaultAsync(x => x.ProduceActivityId == id);
        }

        public async Task<RecordStatusProduceModel?> GetByUserId(int id)
        {
            return await _dbContext.RecordStatusProduce.FirstOrDefaultAsync(x => x.UserId == id);
        }


        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do RecordStatusProduceModelID, senso assim possibilitando a alteração de dados.
        public async Task<RecordStatusProduceModel?> Include(RecordStatusProduceModel recordModel)
        {
            RecordStatusProduceModel recordStatusUp = await GetByRecordStatusId(recordModel.Id);
            if (recordStatusUp == null)
            {
                // include
                recordModel.DateEvent = recordModel.DateEvent ?? DateTime.Now;
                await _dbContext.RecordStatusProduce.AddAsync(recordModel);
                await _dbContext.SaveChangesAsync();

            }
            else
            {
                // update
                recordStatusUp.UserId = recordModel.UserId;
                recordStatusUp.ProduceActivityId = recordModel.ProduceActivityId;
                recordStatusUp.Description = recordModel.Description;
                recordStatusUp.DateEvent = recordModel.DateEvent;
                _dbContext.RecordStatusProduce.Update(recordStatusUp);
                await _dbContext.SaveChangesAsync();
            }
            return recordStatusUp;
        }


        public async Task<RecordStatusProduceModel> Delete(int id)
        {
            RecordStatusProduceModel recordStatusDel = await GetByRecordStatusId(id);
            _dbContext.RecordStatusProduce.Remove(recordStatusDel);
            await _dbContext.SaveChangesAsync();
            return recordStatusDel;
        }


    }
}
