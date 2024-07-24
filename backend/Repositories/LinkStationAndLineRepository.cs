using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Repositories
{
    public class LinkStationAndLineRepository : ILinkStationAndLineRepository
    {
        private readonly BiometricFaceDBContex _dbContext;

        public LinkStationAndLineRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }

        public async Task<List<LinkStationAndLineModel>> GetAllLinks()
        {
            return await _dbContext.LinkStationAndLines.ToListAsync();
        }

        public async Task<LinkStationAndLineModel?> GetByLineId(int id)
        {
            return await _dbContext.LinkStationAndLines.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<LinkStationAndLineModel?> GetByLinkStationAndLineId(int id)
        {
            return await _dbContext.LinkStationAndLines.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<LinkStationAndLineModel?> GetByStationId(int id)
        {
            return await _dbContext.LinkStationAndLines.FirstOrDefaultAsync(x => x.ID == id);
        }

        public async Task<LinkStationAndLineModel?> Include(LinkStationAndLineModel model)
        {
            LinkStationAndLineModel? linkModel = await GetByLinkStationAndLineId(model.ID);
            if (linkModel == null)
            {
                //include
                model.Created = DateTime.Now;
                model.LastUpdated = DateTime.Now;
                await _dbContext.LinkStationAndLines.AddAsync(model);
                await _dbContext.SaveChangesAsync();
                linkModel = await GetByLinkStationAndLineId(model.ID);
            }
            else
            {
                //update
                model.LastUpdated = DateTime.Now;
                linkModel.ID = model.ID;
                linkModel.LineID = model.LineID;
                linkModel.StationID = model.StationID;
                _dbContext.LinkStationAndLines.Update(linkModel);
                await _dbContext.SaveChangesAsync();
            }
            return linkModel;
        }

        public async Task<LinkStationAndLineModel> Delete(int id)
        {
            LinkStationAndLineModel? linkModel = await GetByLinkStationAndLineId(id);
            if (linkModel == null)
            {
                throw new Exception($"Linha com ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext?.LinkStationAndLines.Remove(linkModel);
            await _dbContext.SaveChangesAsync();
            return linkModel;
        }
    }
}
