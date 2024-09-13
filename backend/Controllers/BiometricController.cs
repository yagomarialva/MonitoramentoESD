using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using BiometricFaceApi.Services;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Models;



namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BiometricController : ControllerBase
    {

        protected readonly UserService _userService;
        protected readonly ImageService _imageService;
        protected readonly ProduceActivityService _produceActivityService;
        protected readonly BiometricService _biometricService;

       
        
        public BiometricController(IUsersRepository usersRepository,
                                   IImageRepository imageRepository,
                                   IProduceActivityRepository produceActivityRepository)
        {
            _userService = new UserService(usersRepository);
            _imageService = new ImageService(imageRepository);
            _biometricService = new BiometricService(_userService, _imageService,_produceActivityService);
 
           
        }
        /// <summary>
        /// Buscar todos operadores
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,tecnico,developer")]
        [HttpGet]
        [Route("todosUsers")]
        public async Task<ActionResult> GetAllUsers()
        {
            var response = await _biometricService.GetAllUsers();
            return Ok(response);
        }

        /// <summary>
        /// Buscar operadores pelo badge
        /// </summary>
        /// <response code="200">Retorna dados de operadores.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,tecnico,developer")]
        [HttpGet]
        [Route("Badge")]
        public async Task<ActionResult> GetByBadge(string badge)
        {
            var response = await _biometricService.GetUserByBadger(badge);
            return Ok(response);
        }


        /// <summary>
        /// Cadastra e Atualiza de dados do operador.
        /// </summary>
        /// <remarks>Cadastra o operador na base de dados; Para atualizar dados basta usar a matricula do operador.</remarks>
        /// <param name="biometric">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,tecnico,developer")]
        [HttpPost]
        [Route("adicionar")]
        public async Task<ActionResult> InsertBiometric([FromForm] BiometricModel biometric)
        {
            var result = await _biometricService.ManagerOperator(biometric);

            return StatusCode(result.Item2, result.Item1);

        }

        /// <summary>
        /// Buscar operador pelo id
        /// </summary>
        /// <param name="id"> Buscar operador</param>
        /// <response code="200">Retorna dados do operador.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,tecnico,developer")]
        [HttpGet]
        [Route("operador/{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            var response = await _biometricService.GetUserById(id);
            return Ok(response);
        }

        /// <summary>
        /// Deleta operador
        /// </summary>
        /// <param name="id"> Deleta operador</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,tecnico,developer")]
        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<ActionResult> DeleteBiometic(int id)
        {
            var (result, statusCode) = await _biometricService.DelByUser(id);
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
