using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LinkStationAndLineController : ControllerBase
    {
        private readonly LinkStationAndLineService _service;
        private readonly StationService _stationService;
        private readonly LineService _lineService;


        public LinkStationAndLineController(ILinkStationAndLineRepository linkStationAndLineRepository, IStationRepository stationService, ILineRepository lineService)
        {
            _lineService = new LineService(lineService);
            _service = new LinkStationAndLineService(linkStationAndLineRepository, stationService, lineService);

        }

        /// <summary>
        /// Buscar todos os links
        /// </summary>
        /// <response code="200">Retorna todos os links.</response>
        /// <response code="404">Nenhum link encontrado.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("todosLinks")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllLinkStationAndLineAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar um link específico
        /// </summary>
        /// <response code="200">Retorna o link buscado.</response>
        /// <response code="404">Link não encontrado.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("{id}")]
        public async Task<ActionResult> BuscarPorId(int id)
        {
            var (result, statusCode) = await _service.GetLinkStationAndLineIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar links por linha
        /// </summary>
        /// <response code="200">Retorna os links da linha.</response>
        /// <response code="404">Linha não encontrada.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("linksPorLinha/{id}")]
        public async Task<ActionResult> LinksPorLinha(int id)
        {
            var (result, statusCode) = await _service.GetLineIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar links por estação
        /// </summary>
        /// <response code="200">Retorna os links da estação.</response>
        /// <response code="404">Estação não encontrada.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("linksPorEstacao/{id}")]
        public async Task<ActionResult> LinksPorEstacao(int id)
        {
            var (result, statusCode) = await _service.GetStationIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Incluir um novo link
        /// </summary>
        /// <response code="201">Link criado com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpPost("incluir")]
        public async Task<ActionResult> Incluir([FromBody] LinkStationAndLineModel model)
        {
            var (result, statusCode) = await _service.IncludeAsync(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deletar um link
        /// </summary>
        /// <response code="200">Link deletado com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Deletar(int id)
        {
            var (result, statusCode) = await _service.DeleteAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
