using BiometricFaceApi.Auth;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Security;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net;
using System.Text.Json;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : Controller
    {
        private readonly JwtAuthentication auth;
        private readonly IAuthenticationRepository authRepository;
        private readonly AuthenticationService _authService;
        private readonly SecurityService securityService;
        public AuthenticationController(IAuthenticationRepository authRepository, JwtAuthentication auth, SecurityService securityService)
        {

            this.auth = auth;
            this.authRepository = authRepository;
            this.securityService = securityService;
            _authService = new AuthenticationService(authRepository, auth, securityService);
        }

        /// <summary>
        /// Rota de autenticação de usuários cadastrados no banco de dados.
        /// </summary>
        /// <param name="login"></param>
        [AllowAnonymous]
        [HttpPost]
        [SwaggerResponse((int)HttpStatusCode.OK, Description = "Login realizado com sucesso.")]
        [SwaggerResponse((int)HttpStatusCode.Unauthorized, Description = "Usuário nao cadastrado.")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            IActionResult response = Unauthorized();
            var user = await _authService.AuthenticateUser(login);

            if (user != null)
            {
                var tokenString = auth.GenerateJSONWebToken();
                response = Ok(new { token = tokenString });
            }
            return response;

        }

        /// <summary>
        /// Cadastra e Atualiza de dados do operador.
        /// </summary>
        /// <remarks>Cadastra o engenheiro na base de dados; Para atualizar dados basta usar a matricula do engenheiro.</remarks>
        /// <param name="authModel">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <reponse  code="500">Erro do servidor interno!</reponse>
        [Authorize]
        [HttpPost]
        [Route("/criacao")]
        public async Task<ActionResult> InsertAuths(AuthenticationModel authModel)
        {
            var result = await _authService.ManagerAuth(authModel);
            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Buscar operador pelo id
        /// </summary>
        /// <param name="id"> Buscar operador</param>
        /// <returns></returns>
        /// <response code="200">Retorna dados do banco de dados..</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <reponse  code="500">Erro do servidor interno!</reponse>
        [Authorize]
        [HttpGet]
        [Route("/{id}")]
        public async Task<ActionResult> GetAuthsById(int id)
        {
            var (response, statusCode) = await _authService.GetAtuhById(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(response, options);
            return StatusCode(statusCode, jsonResponse);
        }

        /// <summary>
        /// Deleta operador
        /// </summary>
        /// <param name="id"> Deletar operador</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <reponse  code="500">Erro do servidor interno!</reponse>
        [Authorize]
        [HttpDelete]
        [Route("/{id}")]
        public async Task<ActionResult> DeleteAtuhs(int id)
        {
            var (result, statusCode) = await _authService.DelByAtuh(id);
            return StatusCode(statusCode, result);
        }


    }
}
