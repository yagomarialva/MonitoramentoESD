using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RolesService _service;

        public RolesController(IRolesRepository repository)
        {
            _service = new RolesService(repository);
        }

        /// <summary>
        /// Recupera todas as funções.
        /// </summary>
        /// <response code="200">Retorna todas as funções.</response>
        /// <response code="400">Nenhuma função encontrada.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro interno do servidor!</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllRoles()
        {
            var (result, statusCode) = await _service.GetAllRolesAsync();
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Recupera uma função pelo seu ID.
        /// </summary>
        /// <param name="id">O ID da função a ser recuperada.</param>
        /// <response code="200">Retorna dados da função.</response>
        /// <response code="404">Função não encontrada.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro interno do servidor!</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRoleById(int id)
        {
            var (result, statusCode) = await _service.GetRoleByIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Adiciona ou atualiza uma função.
        /// </summary>
        /// <param name="model">Dados da função para adição ou atualização.</param>
        /// <response code="200">Função atualizada com sucesso.</response>
        /// <response code="201">Função adicionada com sucesso.</response>
        /// <response code="400">Dados inválidos fornecidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro interno do servidor!</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpPost]
        public async Task<IActionResult> UpsertRole([FromBody] RolesModel model)
        {
            var (response, statusCode) = await _service.IncludeRoleAsync(model);
            return StatusCode(statusCode, response);
        }

        /// <summary>
        /// Exclui uma função pelo seu ID.
        /// </summary>
        /// <param name="id">O ID da função a ser excluída.</param>
        /// <response code="200">Função excluída com sucesso.</response>
        /// <response code="404">Função não encontrada.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro interno do servidor!</response>
       [Authorize(Roles = "administrador,tecnico")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var (result, statusCode) = await _service.DeleteRoleAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
