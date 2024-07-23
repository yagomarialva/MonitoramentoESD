﻿using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Repositories
{
    public class ProduceActivityRepository : IProduceActivityRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public ProduceActivityRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<ProduceActivityModel>> GetAllProduceActivity()
        {
            return await _dbContext.ProduceActivity.ToListAsync();
        }
        public async Task<ProduceActivityModel?> GetByProduceActivityId(int id)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.ID == id);
        }
        public async Task<ProduceActivityModel?> GetByProduceMonitorId(int monitorProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.MonitorEsdId == monitorProduce);
        }
        public async Task<ProduceActivityModel?> GetByProduceJigId(int jigProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.JigId == jigProduce);
        }
        public async Task<ProduceActivityModel?> GetByProduceUserId(int usersProduce)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.UserId == usersProduce);
        }

        public async Task<ProduceActivityModel?> GetByStationId(int station)
        {
            return await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.StationId == station);
        }

        public async Task<ProduceActivityModel?> Islocked(int id, bool locked)
        {
            var result = await _dbContext.ProduceActivity.FirstOrDefaultAsync(x => x.ID == id);
            if (result != null)
            {
                result.IsLocked = locked;
                _dbContext.ProduceActivity.Update(result);
                await _dbContext.SaveChangesAsync();
                return result;
            }
            else
            {
                throw new Exception("Id inválido.");
            }

        }

        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do ProduceActivityID, senso assim possibilitando a alteração de dados.
        public async Task<ProduceActivityModel?> Include(ProduceActivityModel produceModel)
        {
            ProduceActivityModel? produceActivityModelUp = await GetByProduceActivityId(produceModel.ID);
            if (produceActivityModelUp == null)
            {
                // include
                await _dbContext.ProduceActivity.AddAsync(produceModel);
                await _dbContext.SaveChangesAsync();
                produceActivityModelUp = await GetByProduceActivityId(produceModel.ID);
            }
            else
            {
                // update
                produceActivityModelUp.UserId = produceModel.UserId;
                produceActivityModelUp.MonitorEsdId = produceModel.MonitorEsdId;
                produceActivityModelUp.JigId = produceModel.JigId;
                produceActivityModelUp.StationId = produceModel.StationId;
                produceActivityModelUp.IsLocked = produceModel.IsLocked;
                produceActivityModelUp.Description = produceModel.Description;
                _dbContext.ProduceActivity.Update(produceActivityModelUp);
                await _dbContext.SaveChangesAsync();
            }
            return produceActivityModelUp;
        }
        public async Task<ProduceActivityModel?> Delete(int id)
        {
            ProduceActivityModel produceActivityModelDel = await GetByProduceActivityId(id);
            if (produceActivityModelDel == null)
            {
                throw new Exception($"Atividade de Produção com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.ProduceActivity.Remove(produceActivityModelDel);
            await _dbContext.SaveChangesAsync();
            return produceActivityModelDel;
        }

       
    }
}