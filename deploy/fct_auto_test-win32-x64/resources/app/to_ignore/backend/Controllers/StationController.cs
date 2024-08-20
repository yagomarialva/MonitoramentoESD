using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StationController : Controller
    {
        private readonly StationService _service;
        public StationController(IStationRepository stationRepository)
        {
            _service = new StationService(stationRepository);
        }

        /// <summary>
        /// Buscar todos
        /// </summary>
        /// <param > Buscar todas Estações</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todosEstacoes")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllStation();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
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
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarEstacao/{id}")]
        public async Task<ActionResult> BuscarEstacaoId(int id)
        {
            var (result, statusCode) = await _service.GetStationId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
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
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarEstacao")]
        public async Task<ActionResult> ManagerEstacao(StationModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar Estação
        /// </summary>
        /// <param name="id"> Deleta  Estação</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteEstação")]
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
