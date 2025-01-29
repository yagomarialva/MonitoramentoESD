using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonitorEsdController : ControllerBase
    {
        private readonly MonitorEsdService _service;
        private readonly StationViewService _stationViewService;

        public MonitorEsdController(IMonitorEsdRepository monitorEsdRepository, IStationViewRepository stationViewRepository)
        {
            _service = new MonitorEsdService(monitorEsdRepository, stationViewRepository);
        }

        /// <summary>
        /// Busca todos os monitores ESD.
        /// </summary>
        /// <returns>Retorna todos os monitores cadastrados.</returns>
        /// <response code="200">Retorna todos os monitores.</response>
        /// <response code="404">Nenhum monitor encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("todosmonitores")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllMonitorEsds();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca um monitor ESD por ID.
        /// </summary>
        /// <param name="id">ID do monitor a ser buscado.</param>
        /// <returns>Retorna o monitor solicitado.</returns>
        /// <response code="200">Retorna o monitor encontrado.</response>
        /// <response code="404">Monitor não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> BuscarIdMonitor(int id)
        {
            var (result, statusCode) = await _service.GetMonitorId(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca um monitor ESD por Serial Number.
        /// </summary>
        /// <param name="serialNumber"> Serial Number do monitor a ser buscado.</param>
        /// <returns>Retorna o monitor solicitado.</returns>
        /// <response code="200">Retorna o monitor encontrado.</response>
        /// <response code="404">Monitor não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("Pesquisa{serialNumber}")]
        public async Task<ActionResult> BuscarMonitorBySerialNumber(string serialNumber)
        {
            var (result, statusCode) = await _service.GetMonitorBySerial(serialNumber);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra ou atualiza dados de um monitor ESD.
        /// </summary>
        /// <param name="model">Dados do monitor ESD a serem cadastrados ou atualizados.</param>
        /// <returns>Retorna o resultado da operação.</returns>
        /// <response code="200">Dados atualizados com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpPost]
        [Route("monitores")]
        public async Task<ActionResult> ManagerMonitor([FromBody] MonitorEsdModel model)
        {
            var (result, statusCode) = await _service.Include(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deleta um monitor ESD pelo ID.
        /// </summary>
        /// <param name="id">ID do monitor a ser deletado.</param>
        /// <returns>Resultado da operação.</returns>
        /// <response code="200">Monitor deletado com sucesso.</response>
        /// <response code="404">Monitor não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _service.Delete(id);
            return StatusCode(statusCode, result);
        }
    }
}
