using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Mozilla;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LineViewController : Controller
    {
        private readonly LineViewService _viewRepository;
        public LineViewController(ILineViewRepository lineViewRepository)
        {
            _viewRepository = new LineViewService(lineViewRepository);
        }

        /// <summary>
        /// Buscar todos 
        /// </summary>
        /// <param > Buscar todas as Linhas</param>
        /// <response code="200">Retorna todos.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/todasLineView")]
        public async Task<ActionResult> BuscarTodos()
        {
            var (result, statusCode) = await _viewRepository.GetAllLineView();
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar monitor por Id</param>
        /// <response code="200">Retorna monitor</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLineView{id}")]
        public async Task<ActionResult> BuscarIdLineView(int id)
        {
            var (result, statusCode) = await _viewRepository.GetLineViewId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Linha de produção por Id</param>
        /// <response code="200">Retorna monitor</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLineViewProduction{id}")]
        public async Task<ActionResult> BuscarLineProdution(int id)
        {
            var (result, statusCode) = await _viewRepository.GetLineProduction(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar id 
        /// </summary>
        /// <param name="id"> Buscar Jig por Id</param>
        /// <response code="200">Retorna Jig</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarLineViewJigs{id}")]
        public async Task<ActionResult> BuscarJigId(int id)
        {
            var (result, statusCode) = await _viewRepository.GetJigId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra e Atualiza de dados do Line View.
        /// </summary>
        /// <remarks>Cadastra monitor na base de dados; Para atualizar dados basta usar Id da Line View.</remarks>
        /// <param name="model">Dados de cadastro da Line View</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarLineView")]
        public async Task<ActionResult> Include(LineViewModel model)
        {
            var result = await _viewRepository.Include(model);

            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Deletar Linew View
        /// </summary>
        /// <param name="id"> Deleta Lnew View</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/deleteLineView")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _viewRepository.Delete(id);
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
