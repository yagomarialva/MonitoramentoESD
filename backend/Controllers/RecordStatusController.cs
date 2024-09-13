using BiometricFaceApi.Models;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordStatusController : ControllerBase
    {
        private RecordStatusService _service;
        public RecordStatusController(RecordStatusService recordStatusService)
        {
            _service = recordStatusService;
        }

        /// <summary>
        /// Busca todos
        /// </summary>
        /// <response code="200">Retorna todos os status.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer, tecnico")]
        [HttpGet]
        [Route("todosStatus")]
        public async Task<ActionResult> BuscarTodos() 
        {
            var (result, statusCode) = await _service.GetAllStatus();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar status de produção por id
        /// </summary>
        /// <param name="id"> Buscar status por id</param>
        /// <response code="200">Retorna dados de status.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer, tecnico")]
        [HttpGet]
        [Route("buscasStatus/{id}")]
        public async Task<ActionResult> GetStatusAsync(int id) 
        {
            var (result, statusCode) = await _service.GetByRecordStatusId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza status.
        /// </summary>
        /// <remarks>Altera status da produção .</remarks>
        /// <param name="model">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer, tecnico")]
        [HttpPost]
        [Route("adicionarStatus")]
        public async Task<ActionResult> ManagerMonitor(RecordStatusProduceModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar status
        /// </summary>
        /// <param name="id"> Deleta status</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer, tecnico")]
        [HttpDelete]
        [Route("deleteStatus/{id}")]
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
