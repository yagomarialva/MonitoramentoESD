using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace BiometricFaceApi.Repositories
{
    public class MonitorEsdRepository : IMonitorEsdRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public MonitorEsdRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<MonitorEsdModel>> GetAllMonitor()
        {
            return await _dbContext.MonitorEsds.ToListAsync();
        }
        public async Task<MonitorEsdModel> GetByMonitorId(int id)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.Id == id) ?? new MonitorEsdModel();
        }
        // Task realiza o include e update, include caso nao haja no banco, update caso o Monitor ja 
        // tenha alguma propriedade cadastrada.
        public async Task<MonitorEsdModel?> Inclue(MonitorEsdModel eventModel)
        {
            if (eventModel == null)
            {
                throw new ArgumentNullException("Valor do Evento não pode ser nulo");
            }
            MonitorEsdModel? eventModelUp = await GetByMonitorId(eventModel.Id);
            if (eventModelUp == null)
            {
                // include
                await _dbContext.MonitorEsds.AddAsync(eventModel);
                await _dbContext.SaveChangesAsync();

                var savedEevent = await _dbContext.MonitorEsds.FirstOrDefaultAsync(newEvent => newEvent.Id == eventModel.Id);
                eventModel.Id = savedEevent.Id;
            }
            else
            {
                // update
                var update = await _dbContext.MonitorEsds.AsNoTracking().FirstOrDefaultAsync(x => x.Id == eventModel.Id);
                eventModel.Id = eventModelUp.Id;
                eventModelUp = eventModel;
                await _dbContext.MonitorEsds.AddAsync(eventModel);
                await _dbContext.SaveChangesAsync();
            }
            return eventModel;
        }
        public async Task<MonitorEsdModel> Delete(int id)
        {
            MonitorEsdModel eventModelDel = await GetByMonitorId(id);
            _dbContext.MonitorEsds.Remove(eventModelDel);
            await _dbContext.SaveChangesAsync();
            return eventModelDel;
        }
    }
}
