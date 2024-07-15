using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private RolesService _service;
        public RolesController(IRolesRepository service)
        {
            _service = new RolesService(service);
        }
        /// <summary>
        /// Busca todos
        /// </summary>
        /// <response code="200">Retorna todos os roles.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todosRoles")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllRoles();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar roles de produção por id
        /// </summary>
        /// <param name="id"> Buscar roles por id</param>
        /// <response code="200">Retorna dados de roles.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/buscaRoles/{id}")]
        public async Task<ActionResult> GetStatusAsync(int id)
        {
            var (result, statusCode) = await _service.GetByRolesId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza roles.
        /// </summary>
        /// <remarks>Altera roles .</remarks>
        /// <param name="model">Dados de cadastro de roles</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarRoles")]
        public async Task<ActionResult> ManagerMonitor(RolesModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar roles
        /// </summary>
        /// <param name="id"> Deleta roles</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteRoles/{id}")]
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
