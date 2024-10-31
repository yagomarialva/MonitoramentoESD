using BiometricFaceApi.Models;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StationController : ControllerBase
    {
        private readonly StationService _service;

        // Injetando o StationService diretamente
        public StationController(StationService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Buscar todos
        /// </summary>
        /// <param > Buscar todas Estações</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("todosEstacoes")]
        public async Task<IActionResult> GetAllStations()
        {
            var (result, statusCode) = await _service.GetAllStationsAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Estação por Id</param>
        /// <response code="200">Retorna  Estação </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("BuscarEstacao/{id}")]
        public async Task<IActionResult> GetStationById(int id)
        {
            var (result, statusCode) = await _service.GetStationByIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="name"> Buscar Estação por name</param>
        /// <response code="200">Retorna  Estação </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("BuscarNomeEstacao/{name}")]
        public async Task<IActionResult> GetStationByName(string name)
        {
            var (result, statusCode) = await _service.GetStationByNameAsync(name);
            return StatusCode(statusCode, result);
        }
        /// <summary>
        /// Cadastra e Atualiza de dados da Estação.
        /// </summary>
        /// <remarks>Cadastra estação na base de dados; Para atualizar dados basta usar Id da estação.</remarks>
        /// <param name="model">Dados de cadastro da estação</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost]
        [Route("adicionarEstacao")]
        public async Task<IActionResult> AddOrUpdateStation([FromBody] StationModel model)
        {
            var (result, statusCode) = await _service.AddOrUpdateStationAsync(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deletar Estação
        /// </summary>
        /// <param name="id"> Deleta  Estação</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpDelete]
        [Route("deleteEstação")]
        public async Task<IActionResult> DeleteStation(int id)
        {
            var (result, statusCode) = await _service.DeleteStationAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
