using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controler]")]
    [ApiController]
    public class LineController : Controller
    {
        private readonly LineService _service;
        public LineController(ILineRepository lineRepository)
        {
            _service = new LineService(lineRepository);
        }
        /// <summary>
        /// Busca todos
        /// </summary>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/TodasLinhas")]
        public async Task<ActionResult> BuscarTodaLinha()
        {
            var (result, statusCode) = await _service.GetAllLine();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar por ID
        /// </summary>
        /// <param name="id"> Buscar linha por id</param>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLinha/{id}")]
        public async Task<ActionResult> BuscarLinha(int id)
        {
            var (result, statusCode) = await _service.GetLineId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }


        /// <summary>
        /// Buscar dados de linha por nome
        /// </summary>
        /// <param name="id"> Buscar produção por nome</param>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarNome/{name}")]
        public async Task<ActionResult> BuscarNome(string name)
        {
            var (result, statusCode) = await _service.GetLineName(name);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Cadastra e Atualiza dados da Linha
        /// </summary>
        /// <remarks>Cadastra produção na base de dados; Para atualizar dados basta usar o id .</remarks>
        /// <param name="model">Dados de cadastro de linha</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarLinha")]
        public async Task<ActionResult> Include([FromBody] LineModel model)
        {

            var (result, statusCode) = await _service.Include(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deletar linha
        /// </summary>
        /// <param name="id"> Deleta linha</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/DeleteLinha/{id}")]
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
