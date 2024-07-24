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
    public class LinkStationAndLineController : Controller
    {
        private readonly LinkStationAndLineService _service;
        public LinkStationAndLineController(ILinkStationAndLineRepository linkStationAndLineRepository)
        {
            _service = new LinkStationAndLineService(linkStationAndLineRepository);
        }
        /// <summary>
        /// Buscar todos
        /// </summary>
        /// <param > Buscar todos Links</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todosLinks")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllLinkStationAndLine();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Link por Id</param>
        /// <response code="200">Retorna  Estação </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLink/{id}")]
        public async Task<ActionResult> BuscarLinkId(int id)
        {
            var (result, statusCode) = await _service.GetLinkStationAndLineId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar linha por id 
        /// </summary>
        /// <param name="id"> Buscar Linha por Id</param>
        /// <response code="200">Retorna  Estação </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLine/{id}")]
        public async Task<ActionResult> BuscarLineId(int id)
        {
            var (result, statusCode) = await _service.GetLineId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar Estação por id 
        /// </summary>
        /// <param name="id"> Buscar Estação por Id</param>
        /// <response code="200">Retorna  Estação </response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/Buscarestacao/{id}")]
        public async Task<ActionResult> BuscarEstacaoId(int id)
        {
            var (result, statusCode) = await _service.GetStationId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza de dados da Links .
        /// </summary>
        /// <remarks>Cadastra Link na base de dados; Para atualizar dados basta usar Id do Link.</remarks>
        /// <param name="model">Dados de cadastro da Link</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarLinks")]
        public async Task<ActionResult> ManagerEstacao(LinkStationAndLineModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar Link
        /// </summary>
        /// <param name="id"> Deleta  Link</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteLink")]
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
