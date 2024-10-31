using BiometricFaceApi.Models;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LineController : ControllerBase
    {
        private readonly LineService _service;
        public LineController(LineService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Busca todas as linhas
        /// </summary>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("TodasLinhas")]
        public async Task<ActionResult> BuscarTodaLinha()
        {
            var (result, statusCode) = await _service.GetAllLinesAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar linha por ID
        /// </summary>
        /// <param name="id">ID da linha</param>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="400">Dados incorretos ou inválidos.
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("BuscarLinha/{id}")]
        public async Task<ActionResult> BuscarLinha(int id)
        {
            var (result, statusCode) = await _service.GetLineByIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar linha por nome
        /// </summary>
        /// <param name="name">Nome da linha</param>
        /// <response code="200">Retorna dados de linha.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("BuscarNome/{name}")]
        public async Task<ActionResult> BuscarNome(string name)
        {
            var (result, statusCode) = await _service.GetLineByNameAsync(name);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastrar ou atualizar uma linha
        /// </summary>
        /// <param name="model">Modelo de dados da linha</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost("adicionarLinha")]
        public async Task<ActionResult> Include([FromBody] LineModel model)
        {
            var (result, statusCode) = await _service.AddOrUpdateLineAsync(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deletar uma linha
        /// </summary>
        /// <param name="id">ID da linha a ser deletada</param>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpDelete("DeleteLinha/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _service.DeleteLineAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
