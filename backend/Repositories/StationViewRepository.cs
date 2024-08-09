using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class StationViewRepository : IStationViewRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public StationViewRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<StationViewModel>> GetAllStationView()
        {
            return await _dbContext.StationViews.ToListAsync();
        }

        public async Task<StationViewModel?> GetByStationViewId(Guid id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.ID == id);
        }
        public async Task<StationViewModel?> GetByStationProductionId(Guid id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<StationViewModel?> GetByPositionSeguenceId(Guid id)
        {
            return await _dbContext.StationViews.FirstOrDefaultAsync(x => x.ID == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationViewModel?> Include(StationViewModel stationView)
        {

            StationViewModel? stationModelUp = await GetByStationViewId(stationView.ID);


            if (stationModelUp == null)
            {
                // include
                var linkDetails = await _dbContext.LinkStationAndLines.FindAsync(stationView.LinkStationAndLineId);

                if (linkDetails == null)
                    throw new Exception("Id de link é invalido!");

                stationView.LinkStationAndLine = linkDetails;
                stationView.LinkStationAndLine.Station = await _dbContext.Station.FindAsync(stationView.LinkStationAndLine.StationID);

                var linkWithMonitor = await _dbContext.StationViews.Where(link => (link.MonitorEsdId == stationView.MonitorEsdId && link.LinkStationAndLineId == stationView.LinkStationAndLineId) || link.MonitorEsdId == stationView.MonitorEsdId).ToListAsync();

                if (linkWithMonitor.Any())
                    throw new Exception("A combinação de monitor esd e estação já existe ou monitor esd já está vinculado com outra estação!");

                var links = await _dbContext.StationViews.Where(x => x.LinkStationAndLineId == stationView.LinkStationAndLineId).ToListAsync();
                var counterLinks = links.Count();
                var maxQuantity = stationView.LinkStationAndLine.Station?.SizeY * stationView.LinkStationAndLine.Station?.SizeX;

                if (counterLinks >= maxQuantity)
                    throw new Exception($"Quantidade de monitores esd excedida, maximo {maxQuantity}!");
                stationView.PositionSequence = counterLinks;
                await _dbContext.StationViews.AddAsync(stationView);
                await _dbContext.SaveChangesAsync();

            }
            else
            {
                // update

                var linkDetails = await _dbContext.LinkStationAndLines.FindAsync(stationModelUp.LinkStationAndLineId);
                var currentMonitorEsd = await _dbContext.MonitorEsds.FindAsync(stationModelUp.MonitorEsdId);

                stationModelUp.MonitorEsd = currentMonitorEsd;
                stationModelUp.LinkStationAndLine = linkDetails;
                stationModelUp.LinkStationAndLine.Station = await _dbContext.Station.FindAsync(stationModelUp.LinkStationAndLine.StationID);

                var maxQuantity = linkDetails?.Station?.SizeY * linkDetails?.Station?.SizeX ?? 0;

                if (stationView.PositionSequence < 0 || stationView.PositionSequence >= maxQuantity)
                    throw new Exception("A sequência informada não é valida.");

                //check get details about new monitor e new station

                var newMonitorEsd = await _dbContext.MonitorEsds.FindAsync(stationView.MonitorEsdId);
                var newLinkStationAndLine = await _dbContext.LinkStationAndLines.FindAsync(stationView.LinkStationAndLineId);

                if (newMonitorEsd == null)
                    throw new Exception($"Id {stationView.MonitorEsdId} de Monitor ESD é invalido");
                if (newLinkStationAndLine == null)
                    throw new Exception($"Id {stationView.LinkStationAndLineId} de sessão de linha é invalido");
                newLinkStationAndLine.Line = await _dbContext.lineModels.FindAsync(newLinkStationAndLine.LineID);
                newLinkStationAndLine.Station = await _dbContext.Station.FindAsync(newLinkStationAndLine.StationID);

                var lastLinkOfStation = await _dbContext.StationViews.FirstOrDefaultAsync(link => link.LinkStationAndLineId == newLinkStationAndLine.ID);
                MonitorEsdModel? currentMonitorOfNewLinkStationAndLine = null;
                var currentLinkStationAndLineOfNewMonitorEsd = await _dbContext.StationViews.FirstOrDefaultAsync(link => link.MonitorEsdId == newMonitorEsd.ID);

                if (lastLinkOfStation != null)
                    currentMonitorOfNewLinkStationAndLine = await _dbContext.MonitorEsds.FindAsync(lastLinkOfStation.MonitorEsdId);

                // check if monitor have link with another station

                MonitorEsdModel? auxMonitorEsd = stationModelUp.MonitorEsd;
                int auxPositionSequence = stationModelUp.PositionSequence;

                if (stationView.LinkStationAndLineId != stationModelUp.LinkStationAndLineId)
                    throw new Exception($"Não é possivel alterar id de vinculo de estações. Estação de id {stationView.LinkStationAndLineId} e  Monitor esd de id {stationView.MonitorEsdId}, " +
                        $"está sendo relacionado com a Estação de id {stationModelUp.LinkStationAndLineId} e Monitor esd de id {stationModelUp.MonitorEsdId}");

                //monitor esd haven't station

                if (currentLinkStationAndLineOfNewMonitorEsd == null)
                {

                    stationModelUp.MonitorEsdId = newMonitorEsd.ID;
                    stationModelUp.MonitorEsd = newMonitorEsd;
                    stationModelUp.PositionSequence = stationView.PositionSequence;
                }
                else if (!stationModelUp.LinkStationAndLineId.Equals(currentLinkStationAndLineOfNewMonitorEsd.LinkStationAndLineId))
                {

                    stationModelUp.MonitorEsdId = newMonitorEsd.ID;
                    stationModelUp.MonitorEsd = newMonitorEsd;
                    stationModelUp.PositionSequence = stationView.PositionSequence;

                    currentLinkStationAndLineOfNewMonitorEsd.MonitorEsd = auxMonitorEsd;
                    currentLinkStationAndLineOfNewMonitorEsd.MonitorEsdId = auxMonitorEsd.ID;
                    currentLinkStationAndLineOfNewMonitorEsd.PositionSequence = auxPositionSequence;
                    currentLinkStationAndLineOfNewMonitorEsd.LastUpdated = DateTime.Now;
                    _dbContext.StationViews.Update(currentLinkStationAndLineOfNewMonitorEsd);
                }


                stationModelUp.LastUpdated = DateTime.Now;
                _dbContext.StationViews.Update(stationModelUp);
                await _dbContext.SaveChangesAsync();
            }
            return stationView;
        }
        public async Task<StationViewModel> Delete(Guid id)
        {
            StationViewModel lineviewDel = await GetByStationViewId(id);
            if (lineviewDel == null)
            {
                throw new Exception($"Station View com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.StationViews.Remove(lineviewDel);
            await _dbContext.SaveChangesAsync();
            return lineviewDel;
        }

       
    }
}
