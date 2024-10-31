using BiometricFaceApi.Models;
using BiometricFaceApi.OraScripts;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;

namespace BiometricFaceApi.Repositories
{
    public class LineRepository : ILineRepository
    {
        private readonly IOracleDataAccessRepository _oraConnector;

        public LineRepository(IOracleDataAccessRepository oraConnector)
        {
            _oraConnector = oraConnector;
        }

        public async Task<List<LineModel>> GetAllAsync()
        {
            var result = await _oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetAllLine, new { });
            return result;
        }

        public async Task<LineModel?> GetByIdAsync(int id)
        {
            var result = await _oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetLineById, new { id });
            return result.FirstOrDefault();
        }

        public async Task<LineModel?> GetByNameAsync(string name)
        {
            var nameLower = name.Normalize().ToLower().TrimEnd();
            var result = await _oraConnector.LoadData<LineModel, dynamic>(SQLScripts.GetLineByName, new { nameLower });
            return result.FirstOrDefault();
        }

        public async Task<LineModel?> AddOrUpdateAsync(LineModel lineModel)
        {
            try
            {
                //Formata o Name para letras minúsculas
                lineModel.Name = lineModel.Name.ToLowerInvariant();
                if (lineModel.ID > 0)
                {
                    // Atualização de linha existente
                    lineModel.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                    await _oraConnector.SaveData(SQLScripts.UpdateLine, lineModel);
                }
                else
                {
                    // Inclusão de nova linha
                    lineModel.Created = DateTimeHelperService.GetManausCurrentDateTime();
                    lineModel.LastUpdated = DateTimeHelperService.GetManausCurrentDateTime();
                    await _oraConnector.SaveData(SQLScripts.InsertLine, lineModel);
                    lineModel = await GetByNameAsync(lineModel.Name);
                }

                if (_oraConnector.Error != null)
                    throw new Exception($"Erro ao salvar linha: {_oraConnector.Error}");

                return lineModel;
            }
            catch (Exception ex)
            {
                throw new Exception($"Falha ao adicionar ou atualizar a linha: {ex.Message}", ex);
            }
        }

        public async Task<LineModel?> DeleteAsync(int id)
        {
            try
            {
                LineModel? line = await GetByIdAsync(id);
                if (line == null)
                    throw new Exception("Linha não encontrada.");

                await _oraConnector.SaveData<dynamic>(SQLScripts.DeleteLine, new { id });

                if (_oraConnector.Error != null)
                    throw new Exception($"Erro ao deletar linha: {_oraConnector.Error}");

                return line;
            }
            catch (Exception ex)
            {
                throw new Exception($"Falha ao deletar a linha: {ex.Message}", ex);
            }
        }
    }
}
