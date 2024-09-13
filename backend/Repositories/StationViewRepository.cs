using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class StationViewRepository : IStationViewRepository
    {
        private readonly IOracleDataAccessRepository oraConnector;
        private readonly ILinkStationAndLineRepository linkStationAndLineRepository;
        private readonly IMonitorEsdRepository monitorEsdRepository;
        private readonly IStationRepository stationRepository;
        private readonly ILineRepository lineRepository;
        public StationViewRepository(IOracleDataAccessRepository oraConnector,
            ILinkStationAndLineRepository linkStationAndLineRepository, IMonitorEsdRepository monitorEsdRepository, IStationRepository stationRepository, ILineRepository lineRepository)
        {
            this.oraConnector = oraConnector;
            this.linkStationAndLineRepository = linkStationAndLineRepository;
            this.monitorEsdRepository = monitorEsdRepository;
            this.stationRepository = stationRepository;
            this.lineRepository = lineRepository;

        }
        public async Task<List<StationViewModel>> GetAllStationView()
        {
            var result = await oraConnector.LoadData<StationViewModel, dynamic>(SQLScripts.GetAllStationView, new { });
            return result;
        }
        public async Task<StationViewModel?> GetByStationViewId(int guid)
        {
            var id = guid.ToString();    
            var result = await oraConnector.LoadData<StationViewModel, dynamic>(SQLScripts.GetStationViewById, new { id });
            return result.FirstOrDefault();
        }
        public async Task<StationViewModel?> GetByPositionSeguenceId(int postitionId)
        {
            var result = await oraConnector.LoadData<StationViewModel, dynamic>(SQLScripts.GetStationViewPositionById, new { postitionId });
            return result.FirstOrDefault();
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<StationViewModel?> Include(StationViewModel stationView)
        {
            StationViewModel? stationModelUp = await GetByStationViewId(stationView.ID);
            var stationViews = await GetAllStationView();
            if (stationModelUp == null)
            {
                // include
                var linkDetails = await linkStationAndLineRepository.GetByLinkId(stationView.LinkStationAndLineId);
                if (linkDetails == null)
                    throw new Exception("Id de link é invalido!");

                stationView.LinkStationAndLine = linkDetails;
                stationView.LinkStationAndLine.Station = await stationRepository.GetByStationId(stationView.LinkStationAndLine.StationID);

                var linkWithMonitor = stationViews.Where(link => (link.MonitorEsdId == stationView.MonitorEsdId && link.LinkStationAndLineId == stationView.LinkStationAndLineId) || link.MonitorEsdId == stationView.MonitorEsdId).ToList();

                if (linkWithMonitor.Any())
                    throw new Exception("A combinação de monitor esd e estação já existe ou monitor esd já está vinculado com outra estação!");

                var links = stationViews.Where(x => x.LinkStationAndLineId == stationView.LinkStationAndLineId).ToList();
                var counterLinks = links.Count();
                var maxQuantity = stationView.LinkStationAndLine.Station?.SizeY * stationView.LinkStationAndLine.Station?.SizeX;

                if (counterLinks >= maxQuantity)
                    throw new Exception($"Quantidade de monitores esd excedida, maximo {maxQuantity}!");
                stationView.PositionSequence = counterLinks;
                await oraConnector.SaveData<StationViewModel>(SQLScripts.InsertStationView, stationView);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
            }
            else
            {
                // update
                var linkDetails = await linkStationAndLineRepository.GetByLinkId(stationModelUp.LinkStationAndLineId);
                var currentMonitorEsd = await monitorEsdRepository.GetByMonitorId(stationModelUp.MonitorEsdId);

                stationModelUp.MonitorEsd = currentMonitorEsd;
                stationModelUp.LinkStationAndLine = linkDetails;
                stationModelUp.LinkStationAndLine.Station = await stationRepository.GetByStationId(stationModelUp.LinkStationAndLine.StationID);

                var maxQuantity = linkDetails?.Station?.SizeY * linkDetails?.Station?.SizeX ?? 0;

                if (stationView.PositionSequence < 0 || stationView.PositionSequence >= maxQuantity)
                    throw new Exception("A sequência informada não é valida.");
                //check get details about new monitor e new station
                var newMonitorEsd = await monitorEsdRepository.GetByMonitorId(stationView.MonitorEsdId);
                var newLinkStationAndLine = await linkStationAndLineRepository.GetByLinkId(stationView.LinkStationAndLineId);

                if (newMonitorEsd == null)
                    throw new Exception($"Id {stationView.MonitorEsdId} de Monitor ESD é invalido");
                if (newLinkStationAndLine == null)
                    throw new Exception($"Id {stationView.LinkStationAndLineId} de sessão de linha é invalido");

                newLinkStationAndLine.Line = await lineRepository.GetLineID(newLinkStationAndLine.LineID);
                newLinkStationAndLine.Station = await stationRepository.GetByStationId(newLinkStationAndLine.StationID);

                var lastLinkOfStation = stationViews.Where(link => link.LinkStationAndLineId == newLinkStationAndLine.ID).FirstOrDefault();

                MonitorEsdModel? currentMonitorOfNewLinkStationAndLine = null;
                var currentLinkStationAndLineOfNewMonitorEsd = stationViews.Where(link => link.MonitorEsdId == newMonitorEsd.ID).FirstOrDefault();

                if (lastLinkOfStation != null)
                    currentMonitorOfNewLinkStationAndLine = await monitorEsdRepository.GetByMonitorId(lastLinkOfStation.MonitorEsdId);

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

                    await oraConnector.SaveData<StationViewModel>(SQLScripts.UpdateStationView, currentLinkStationAndLineOfNewMonitorEsd);
                    if (oraConnector.Error != null)
                        throw new Exception($"Error:{oraConnector.Error}");

                }

                await oraConnector.SaveData<StationViewModel>(SQLScripts.UpdateStationView, stationModelUp);
                if (oraConnector.Error != null)
                    throw new Exception($"Error:{oraConnector.Error}");
            }
            return stationView;
        }
        public async Task<StationViewModel> Delete(int id)
        {
            StationViewModel? stationViewDel = await GetByStationViewId(id);
            if (stationViewDel == null)
            {
                throw new Exception($" StationView com ID:{id} não foi encontrado no banco de dados.");
            }
            await oraConnector.SaveData<dynamic>(SQLScripts.DeleteStationView, new { id });
            return stationViewDel;
        }
    }
}
