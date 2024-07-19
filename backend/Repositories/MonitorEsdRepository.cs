using BiometricFaceApi.Data;
//using BiometricFaceApi.Migrations;
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
        public async Task<MonitorEsdModel?> GetByMonitorId(int id)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<MonitorEsdModel?> GetUserId(int id)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task<MonitorEsdModel?> GetByMonitorSerial(string serial)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.SerialNumber == serial);
        }
        public async Task<MonitorEsdModel?> GetPositionX(int x)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.PositionX == x);
        }
        public async Task<MonitorEsdModel?> GetPositionY(int y)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.PositionY == y);
        }
        public async Task<bool> PositionExistsAsync(int positionX, int positionY)
        {
            return await _dbContext.MonitorEsds.AnyAsync(e => e.PositionX == positionX && e.PositionY == positionY);


        }
        public async Task<MonitorEsdModel?> GetStatus(string status)
        {
            return await _dbContext.MonitorEsds.FirstOrDefaultAsync(e => e.Status == status);
        }
        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do MonitorModelyID, senso assim possibilitando a alteração de dados.
        public async Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel)
        {

            MonitorEsdModel? monitorModelUp = await GetByMonitorId(monitorModel.Id);
           
            if (monitorModelUp == null)
            {
                // include
                monitorModel.DateHour = DateTime.Now;
                monitorModel.LastDate = DateTime.Now;
                await _dbContext.MonitorEsds.AddAsync(monitorModel);
                await _dbContext.SaveChangesAsync();
                monitorModel = await GetByMonitorSerial(monitorModel.SerialNumber);
            }
            else
            {
                // update
                monitorModel.LastDate = DateTime.Now;
                monitorModelUp.SerialNumber = monitorModel.SerialNumber;
                monitorModel.PositionX = monitorModel.PositionX;
                monitorModel.PositionY = monitorModel.PositionY;
                monitorModel.Status = monitorModel.Status;
                monitorModel.UserId = monitorModel.UserId;
                monitorModelUp.Description = monitorModel.Description;
                _dbContext.MonitorEsds.Update(monitorModelUp);
                await _dbContext.SaveChangesAsync();
            }
            return monitorModel;

        }
        public async Task<MonitorEsdModel> Delete(int id)
        {
            MonitorEsdModel monitorModelDel = await GetByMonitorId(id);
            _dbContext.MonitorEsds.Remove(monitorModelDel);
            await _dbContext.SaveChangesAsync();
            return monitorModelDel;
        }

        
    }
}
