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
        /// <param > Buscar todas estaçõs</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpGet]
        [Route("/todasStations")]
        public async Task<ActionResult> BuscarTodasStations()
        {
            var (result, statusCode) = await _service.GetAllStation();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar estação por id
        /// </summary>
        /// <param name="id"> Buscar estação por id</param>
        /// <response code="200">Retorna dados de estação.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpGet]
        [Route("/buscarStationId{id}")]
        public async Task<ActionResult> BuscarStationId(int id)
        {
            var (result, statusCode) = await _service.GetStationId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza status.
        /// </summary>
        /// <remarks>Cadastra estação na base de dados; Para atualizar dados basta usar o id da estção.</remarks>
        /// <param name="model">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpPost]
        [Route("/gerenciarStation")]
        public async Task<ActionResult> Include(StationModel model)
        {
            var (result,statusCode) = await _service.Include(model);

            return StatusCode(statusCode, result);

        }


        /// <summary>
        /// Deleta estação
        /// </summary>
        /// <param name="id"> Deleta estção</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpDelete]
        [Route("/deleteSation/{id}")]
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
