using BiometricFaceApi.Models;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JigController : ControllerBase
    {
        private readonly JigService _service;

        public JigController(JigService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        /// <summary>
        /// Recupera todos os Jigs.
        /// </summary>
        /// <returns>Uma lista de Jigs.</returns>
        /// <response code="200">Retorna a lista de Jigs.</response>
        /// <response code="500">Se ocorrer um erro interno do servidor.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("todosJigs")]
        public async Task<ActionResult> GetAllJigs()
        {
            var (result, statusCode) = await _service.GetAllJigsAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Recupera um Jig pelo seu ID.
        /// </summary>
        /// <param name="id">O ID do Jig.</param>
        /// <returns>O Jig solicitado.</returns>
        /// <response code="200">Retorna o Jig.</response>
        /// <response code="404">Se o Jig não for encontrado.</response>
        /// <response code="500">Se ocorrer um erro interno do servidor.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("buscarJig/{id}")]
        public async Task<ActionResult> GetJigById(int id)
        {
            var (result, statusCode) = await _service.GetJigByIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Recupera um Jig pelo seu Serial Number.
        /// </summary>
        /// <param name="serialNumber">O Serial Number do Jig.</param>
        /// <returns>O Jig solicitado.</returns>
        /// <response code="200">Retorna o Jig.</response>
        /// <response code="404">Se o Jig não for encontrado.</response>
        /// <response code="500">Se ocorrer um erro interno do servidor.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet("buscarJigBySn/{serialNumber}")]
        public async Task<ActionResult> GetJigBySn(string serialNumber)
        {
            var (result, statusCode) = await _service.GetJigBySnAsync(serialNumber);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Adiciona ou atualiza um Jig.
        /// </summary>
        /// <param name="model">O modelo Jig a ser adicionado ou atualizado.</param>
        /// <returns>O Jig criado ou atualizado.</returns>
        /// <response code="201">Retorna o Jig criado.</response>
        /// <response code="400">Se o modelo fornecido for nulo.</response>
        /// <response code="500">Se ocorrer um erro interno do servidor.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost("gerenciarJigs")]
        public async Task<ActionResult> Include([FromBody] JigModel model)
        {
            var (result, statusCode) = await _service.AddOrUpdateJigAsync(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Exclui um Jig pelo seu ID.
        /// </summary>
        /// <param name="id">O ID do Jig a ser excluído.</param>
        /// <returns>Uma confirmação de exclusão.</returns>
        /// <response code="200">Se o Jig foi excluído com sucesso.</response>
        /// <response code="404">Se o Jig não for encontrado.</response>
        /// 
        /// <response code="500">Se ocorrer um erro interno do servidor.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpDelete("deleteJigs/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _service.DeleteJigAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
