using BiometricFaceApi.Models;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordStatusController : ControllerBase
    {
        private readonly RecordStatusService _service;

        public RecordStatusController(RecordStatusService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Busca todos os status.
        /// </summary>
        /// <response code="200">Retorna todos os status.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("todosStatus")]
        public async Task<IActionResult> GetAllStatus()
        {
            var (result, statusCode) = await _service.GetAllStatusAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar status de produção por ID.
        /// </summary>
        /// <param name="id">ID do status.</param>
        /// <response code="200">Retorna o status de produção correspondente.</response>
        /// <response code="400">ID incorreto ou inválido.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("buscaStatus/{id}")]
        public async Task<IActionResult> GetStatusById(int id)
        {
            var (result, statusCode) = await _service.GetByRecordStatusIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra ou atualiza status de produção.
        /// </summary>
        /// <param name="model">Dados de status a serem cadastrados ou atualizados.</param>
        /// <response code="200">Status atualizado com sucesso.</response>
        /// <response code="201">Status cadastrado com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost("adicionarStatus")]
        public async Task<IActionResult> AddOrUpdateStatus([FromBody] RecordStatusProduceModel model)
        {
            var (result, statusCode) = await _service.AddOrUpdateStatusAsync(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Deleta um status de produção.
        /// </summary>
        /// <param name="id">ID do status a ser deletado.</param>
        /// <response code="200">Status removido com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpDelete("deleteStatus/{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var (result, statusCode) = await _service.DeleteStatusAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
