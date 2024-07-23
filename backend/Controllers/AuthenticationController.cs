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
        public AuthenticationController(IAuthenticationRepository authRepository, JwtAuthentication auth, SecurityService securityService,IRolesRepository rolesRepository)
        {

            this.auth = auth;
            this.authRepository = authRepository;
            this.securityService = securityService;
            _authService = new AuthenticationService(authRepository, auth, securityService, rolesRepository);
        }

        /// <summary>
        /// Autenticação de usuários cadastrados no banco de dados.
        /// </summary>
        /// <param name="login"></param>
        /// <response code="200">Retorna dados de todos operadores.</response>
        /// <response code="401">Usuário nao cadastrado.</response>
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            IActionResult response = Unauthorized();
            var user = await _authService.AuthenticateUser(login);

            if (user != null)
            {
                var tokenString = auth.GenerateJSONWebToken(user);
                response = Ok(new
                {
                    Token = tokenString,
                    Role = user.RolesName,
                    Name = user.Username
                });
            }
            return response;

        }

        /// <summary>
        /// Cadastra e Atualiza de dados.
        /// </summary>
        /// <remarks>Cadastra usuários na base de dados; Para atualizar dados basta usar a matricula do usuário.</remarks>
        /// <param name="authModel">Dados de cadastro do engenheiro</param>
        /// <response code="200">Dados atualizado com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,developer")]
        [HttpPost]
        [Route("/criacao")]
        public async Task<ActionResult> InsertAuths(AuthenticationModel authModel)
        {
            var result = await _authService.ManagerAuth(authModel);
            return StatusCode(result.Item2, result.Item1);
        }

        /// <summary>
        /// Buscar usuários pelo id
        /// </summary>
        /// <param name="id"> Buscar usuário</param>
        /// <returns></returns>
        /// <response code="200">Retorna dados do banco de dados..</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,developer")]
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
        /// Deletar usuários
        /// </summary>
        /// <param name="id"> Deletar usuário</param>
        /// <returns></returns>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrator,developer")]
        [HttpDelete]
        [Route("/{id}")]
        public async Task<ActionResult> DeleteAtuhs(int id)
        {
            var (result, statusCode) = await _authService.DelByAtuh(id);
            return StatusCode(statusCode, result);
        }


    }
}
