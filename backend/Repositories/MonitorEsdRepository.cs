using BiometricFaceApi.Data;
//using BiometricFaceApi.Migrations;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace BiometricFaceApi.Repositories
{
    public class MonitorEsdRepository : IMonitorEsdRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        public MonitorEsdRepository(IOracleDataAccessRepository oraConnector)
        {
            this.oraConnector = oraConnector;
        }
        public async Task<List<MonitorEsdModel>> GetAllMonitor()
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetAllMonitor, new { });
            return result;
        }
        public async Task<MonitorEsdModel?> GetByMonitorId(int id)
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetMonitorId, new { id });
            return result.FirstOrDefault();
        }
        public async Task<MonitorEsdModel?> GetByMonitorSerial(string serial)
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetSerialNumber, new { serial });
            return result.FirstOrDefault();
        }
        public async Task<MonitorEsdModel?> GetStatus(string status)
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetStatus, new { status });
            return result.FirstOrDefault(); 
        }
        public async Task<MonitorEsdModel?> GetStatusOperator(string statusOperador)
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetStatusOP, new { statusOperador });
            return result.FirstOrDefault(); 
        }
        public async Task<MonitorEsdModel?> GetStatusJig(string statusJig)
        {
            var result = await oraConnector.LoadData<MonitorEsdModel, dynamic>(SQLScripts.GetStatusJig, new { statusJig });
            return result.FirstOrDefault();
        }
        // Task realiza o include e update
        // include de novos dados
        // update e feito atraves do MonitorModelID, senso assim possibilitando a alteração de dados.
        public async Task<MonitorEsdModel?> Include(MonitorEsdModel monitorModel)
        {
            MonitorEsdModel? monitorUp; 
            if (monitorModel.ID > 0)
            {
                //update
                await oraConnector.SaveData(SQLScripts.UpdateMonitorEsd, monitorModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                monitorUp = monitorModel;
            }
            else
            {
                //include
                await oraConnector.SaveData<MonitorEsdModel>(SQLScripts.InsertMonitorEsd, monitorModel);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
                monitorUp = await GetByMonitorSerial(monitorModel.SerialNumber);
            }
            return monitorUp;

        }
        public async Task<MonitorEsdModel> Delete(int id)
        {
            MonitorEsdModel? monitorDel = await GetByMonitorId(id);
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteMonitor, new { id });
            return monitorDel;
        }

    }
}
