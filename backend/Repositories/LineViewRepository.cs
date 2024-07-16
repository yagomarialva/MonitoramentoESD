using BiometricFaceApi.Data;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BiometricFaceApi.Repositories
{
    public class LineViewRepository : ILineViewRepository
    {
        private readonly BiometricFaceDBContex _dbContext;
        public LineViewRepository(BiometricFaceDBContex biometricFaceDBContex)
        {
            _dbContext = biometricFaceDBContex;
        }
        public async Task<List<LineViewModel>> GetAllLineView()
        {
            return await _dbContext.LineViews.ToListAsync();
        }

        public async Task<LineViewModel> GetByLineViewId(int id)
        {
            return await _dbContext.LineViews.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<LineViewModel> GetByLineProductionId(int id)
        {
            return await _dbContext.LineViews.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<LineViewModel> GetByJigId(int id)
        {
            return await _dbContext.LineViews.FirstOrDefaultAsync(x => x.Id == id);
        }

        // Task realiza o include e update, include caso nao haja no banco, update caso ja 
        // tenha alguma propriedade cadastrada.
        public async Task<LineViewModel?> Include(LineViewModel lineViewModel)
        {
            var repositoryLineView = await _dbContext.LineViews.FirstOrDefaultAsync(x => x.Id == lineViewModel.Id);
            if (repositoryLineView is null)
            {
                // include

                lineViewModel.Created = lineViewModel.Created ?? DateTime.Now;
                lineViewModel.LastUpdated = lineViewModel.LastUpdated ?? DateTime.Now;
                await _dbContext.LineViews.AddAsync(lineViewModel);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                // update

                repositoryLineView.LineId = lineViewModel.LineId;
                repositoryLineView.LineId = lineViewModel.JigId;
                repositoryLineView.LastUpdated = DateTime.Now;
                _dbContext.LineViews.Update(repositoryLineView);
                await _dbContext.SaveChangesAsync();
            }
            var result = await _dbContext.LineViews.FirstAsync(x => x.Id == lineViewModel.Id);

            return result;
        }
        public async Task<LineViewModel> Delete(int id)
        {
            LineViewModel lineviewDel = await GetByLineViewId(id);
            if (lineviewDel == null)
            {
                throw new Exception($"Jig com o ID:{id} não foi encontrado no banco de dados.");
            }
            _dbContext.LineViews.Remove(lineviewDel);
            await _dbContext.SaveChangesAsync();
            return lineviewDel;
        }


    }
}
