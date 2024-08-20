using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Microsoft.VisualBasic;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduceActivityController : Controller
    {
        private readonly ProduceActivityService _service;
        private readonly RecordStatusService _record;
        private readonly UserService _user;
        private readonly JigService _jig;
        private readonly StationService _station;

        public ProduceActivityController(IProduceActivityRepository produceActivityRepository, IRecordStatusRepository recordStatusRepository, IUsersRepository usersRepository, IAuthenticationRepository authenticationRepository, IJigRepository jigRepository, IStationRepository stationRepository)
        {
            _record = new RecordStatusService(recordStatusRepository);
            _user = new UserService (usersRepository);
            _jig = new JigService (jigRepository);
            _station = new StationService (stationRepository);
            _service = new ProduceActivityService(produceActivityRepository, recordStatusRepository, authenticationRepository,usersRepository, jigRepository, stationRepository);
            
        }

        /// <summary>
        /// Busca todos
        /// </summary>
        /// <response code="200">Retorna dados de produção.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/TodaProducao")]
        public async Task<ActionResult> BuscarTodaProducao()
        {
            var(result, statusCode) = await _service.GetAllProduceAct();
        var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Buscar dados de produção
        /// </summary>
        /// <param name="id"> Buscar produção por id</param>
        /// <response code="200">Retorna dados de produção.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpGet]
        [Route("/BuscarProducao/{id}")]
        public async Task<ActionResult> BuscarTodaProducao(int id)
        {
            var (result, statusCode) = await _service.GetProduceId(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Cadastra e Atualiza de dados de produçao.
        /// </summary>
        /// <remarks>Cadastra produção na base de dados; Para atualizar dados basta usar o id .</remarks>
        /// <param name="model">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/adicionarProducao")]
        public async Task<ActionResult> Include([FromBody] ProduceActivityModel model)
        {

            var (result, statusCode) = await _service.Include(model);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Muda status da produção.
        /// </summary>
        /// <remarks>Cadastra o operador na base de dados; Para atualizar dados basta usar a matricula do operador.</remarks>
        /// <param>Altera status para true ou false</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpPost]
        [Route("/ChangeStatus")]
        public async Task<ActionResult> ChangeStatus(int id, bool status, string? description)
        {
            var accessToken = Request.Headers[HeaderNames.Authorization];
            var token = accessToken.ToString().Split(" ").LastOrDefault();
            var (result, statusCode) = await _service.ChangeStatus(id, status, description, token);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            return StatusCode(statusCode, result);

        }

        /// <summary>
        /// Deletar produção
        /// </summary>
        /// <param name="id"> Deleta produção</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,operator,developer")]
        [HttpDelete]
        [Route("/DeleteProducao/{id}")]
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
