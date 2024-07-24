using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Mozilla;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StationViewController : Controller
    {
        private readonly StationViewService _stationRepository;
        private readonly MonitorEsdService _monitorEsdService;
        private readonly LinkStationAndLineService _linkStationAndLineService;
        private readonly StationService _stationService;
        private readonly LineService _lineService;
        private readonly PositionService _positionService;
        

        public StationViewController(IStationViewRepository stationViewRepository, IMonitorEsdRepository monitorEsdRepository, ILinkStationAndLineRepository linkStationAndLineRepository, IStationRepository stationRepository, ILineRepository lineRepository, IPositionRepository positionRepository )
        {
            _stationRepository = new StationViewService(stationViewRepository, monitorEsdRepository, linkStationAndLineRepository);
            _monitorEsdService = new MonitorEsdService(monitorEsdRepository,positionRepository);
            _linkStationAndLineService = new LinkStationAndLineService(linkStationAndLineRepository, stationRepository, lineRepository);
        }

        /// <summary>
        /// Buscar todos 
        /// </summary>
        /// <param > Buscar todas as Estações View</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todasEstacaoView")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _stationRepository.GetAllStationView();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Estacao View por Id</param>
        /// <response code="200">Retorna Estacao View por Id</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarEstacaView/{id}")]
        public async Task<ActionResult> BuscarIdEstacaoView(Guid id)
        {
            var (result, statusCode) = await _stationRepository.GetStationViewId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Jig por Id</param>
        /// <response code="200">Retorna Jig</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarEstViewJigs/{id}")]
        public async Task<ActionResult> BuscarJigId(Guid id)
        {
            var (result, statusCode) = await _stationRepository.GetJigId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar View Estação de produção por Id</param>
        /// <response code="200">Retorna View  Estação de produção </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarEstacaoDeProducao/{id}")]
        public async Task<ActionResult> BuscarEstacaoDeProducaoId(Guid id)
        {
            var (result, statusCode) = await _stationRepository.GetByStationProductionId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }


        /// <summary>
        /// Cadastra e Atualiza de dados do Estação View.
        /// </summary>
        /// <remarks>Cadastra monitor na base de dados; Para atualizar dados basta usar Id da Estação View.</remarks>
        /// <param name="model">Dados de cadastro da Estavação View</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarEstacaoView")]
        public async Task<ActionResult> Include(StationViewModel model)
        {
            var result = await _stationRepository.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }


        /// <summary>
        /// Deletar Estação View
        /// </summary>
        /// <param name="id"> Deleta Estação View</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteLineView/{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var (result, statusCode) = await _stationRepository.Delete(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            if (!string.IsNullOrEmpty(jsonResponse))
            {
                return StatusCode(statusCode, result);
            }
            else
            {
                return StatusCode(statusCode);
            }
        }
    }
}
