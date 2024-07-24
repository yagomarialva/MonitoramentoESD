using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI.Common;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class MonitorEsdController : Controller
    {
        private readonly MonitorEsdService _service;
        private readonly UserService _userService;
        private readonly PositionService _positionService;
        public MonitorEsdController(IMonitorEsdRepository monitorEsdRepository, IUsersRepository usersRepository, IPositionRepository positionRepository)
        {
            _service = new MonitorEsdService(monitorEsdRepository, usersRepository, positionRepository);
            _userService = new UserService(usersRepository);
            _positionService = new PositionService(positionRepository);
        }

        /// <summary>
        /// Buscar todos 
        /// </summary>
        /// <param > Buscar todos monitores</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todosMonitores")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllMonitorEsds();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
           
        }

        /// <summary>
        /// Buscar monitor
        /// </summary>
        /// <param name="id"> Buscar monitor por Id</param>
        /// <response code="200">Retorna monitor</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarMonitores/{id}")]
        public async Task<ActionResult> BuscarIdMonitor(int id)
        {
            var (result, statusCode) = await _service.GetMonitorId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar Operador
        /// </summary>
        /// <param name="id"> Buscar Operador Id</param>
        /// <response code="200">Retorna monitor</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarOp/{id}")]
        public async Task<ActionResult> BuscarIdOp(int id)
        {
            var (result, statusCode) = await _service.GetUserId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza de dados do monitor.
        /// </summary>
        /// <remarks>Cadastra monitor na base de dados; Para atualizar dados basta usar Id do monitor.</remarks>
        /// <param name="model">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarMonitor")]
        public async Task<ActionResult> ManagerMonitor(MonitorEsdModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar monitor
        /// </summary>
        /// <param name="id"> Deleta monitor</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteMonitor")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _service.Delete(id);
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
