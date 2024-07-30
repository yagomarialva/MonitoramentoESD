using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

/*namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PositionController : Controller
    {
        private readonly PositionService _service;
        public PositionController(IPositionRepository positionRepository) 
        {
            _service = new PositionService(positionRepository);
        }

        /// <summary>
        /// Buscar todos 
        /// </summary>
        /// <param > Buscar todas posições</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todasPosicoes")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _service.GetAllPositions();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar posição
        /// </summary>
        /// <param name="id"> Buscar posição por Id</param>
        /// <response code="200">Retorna monitor</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarPosicao/{id}")]
        public async Task<ActionResult> BuscarPosicao(int id)
        {
            var (result, statusCode) = await _service.GetPositionId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        ///// <summary>
        ///// Buscar tamanho X por ID
        ///// </summary>
        ///// <param name="id"> Buscar tamanho X por ID/param>
        ///// <response code="200">Retorna tamnho X</response>
        ///// <response code="400">Dados incorretos ou inválidos.</response>
        ///// <response code="401">Acesso negado devido a credenciais inválidas</response>
        ///// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        //[HttpGet]
        //[Route("/BuscarSizeX/{id}")]
        //public async Task<ActionResult> BuscarSizeX(int id)
        //{
        //    var (result, statusCode) = await _service.GetSizeX(id);
        //    var options = new JsonSerializerOptions { WriteIndented = true };
        //    string jsonResponse = JsonSerializer.Serialize(result, options);
        //    return StatusCode(statusCode, result);
        //}

        ///// <summary>
        ///// Buscar tamanho Y por ID
        ///// </summary>
        ///// <param name="id"> Buscar tamanho Y por ID/param>
        ///// <response code="200">Retorna tamnho Y</response>
        ///// <response code="400">Dados incorretos ou inválidos.</response>
        ///// <response code="401">Acesso negado devido a credenciais inválidas</response>
        ///// <response  code="500">Erro do servidor interno!</response>
        //[Authorize(Roles = "administrator,operator,developer")]
        //[HttpGet]
        //[Route("/BuscarSizeY/{id}")]
        //public async Task<ActionResult> BuscarSizeY(int id)
        //{
        //    var (result, statusCode) = await _service.GetSizeX(id);
        //    var options = new JsonSerializerOptions { WriteIndented = true };
        //    string jsonResponse = JsonSerializer.Serialize(result, options);
        //    return StatusCode(statusCode, result);
        //}

        /// <summary>
        /// Cadastra e Atualiza de posição, sizeX e seizY.
        /// </summary>
        /// <remarks>Cadastra monitor na base de dados; Para atualizar dados basta usar Id da posição.</remarks>
        /// <param name="model">Dados de cadastro de posição</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarPosicao")]
        public async Task<ActionResult> ManagerMonitor(PositionModel model)
        {
            var result = await _service.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar posição
        /// </summary>
        /// <param name="id"> Deleta posição</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deletePosição")]
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
*/

