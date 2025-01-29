using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BiometricController : ControllerBase
    {
        protected readonly UserService _userService;
        protected readonly ImageService _imageService;
        protected readonly BiometricService _biometricService;
        protected readonly JigService _jigRepository;
        private readonly StatusJigAndUserService _statusJigAndUserService;
        private readonly ILastLogMonitorEsdRepository _lastLogMonitorEsdRepository;


        public BiometricController(UserService userService,
                                ImageService imageService,
                                BiometricService biometricService, JigService jigRepository, StatusJigAndUserService statusJigAndUserService, ILastLogMonitorEsdRepository lastLogMonitorEsdRepository)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _imageService = imageService ?? throw new ArgumentNullException(nameof(imageService));
            _biometricService = biometricService ?? throw new ArgumentNullException(nameof(biometricService));
            _jigRepository =  jigRepository ?? throw new ArgumentNullException(nameof(jigRepository));
            _statusJigAndUserService = statusJigAndUserService ?? throw new ArgumentException(nameof(statusJigAndUserService));
            _lastLogMonitorEsdRepository = lastLogMonitorEsdRepository ?? throw new ArgumentException(nameof(lastLogMonitorEsdRepository));
        }

        /// <summary>
        /// Buscar todos operadores.
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores com imagem.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("ListUsersPaginated")]
        public async Task<ActionResult> GetUsersPaginated([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var (result, statusCode) = await _biometricService.GetUsersPaginatedAsync(page, pageSize);
            return StatusCode(statusCode, result);
            
        }

        [HttpPost]
        [Route("verifyJigAndFace")]
        public async Task<IActionResult> VerifyJigAndFace(IFormFile imageFile, string serialNumber)
        {
            // Valida o arquivo de imagem
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest(new { message = "Arquivo de imagem inválido ou não fornecido." });
            }

            // Chama o serviço de verificação de Jig e reconhecimento facial
            var (personId, jig, user, statusJig, statusUser) = await _biometricService.Verify(imageFile, serialNumber);

            // Valida os resultados da verificação
            if (jig == null)
            {
                return NotFound(new { message = "Jig não encontrado." });
            }

            if (personId == 0)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }


            // Determina o status do Jig
            string jigStatus = statusJig == 0 ? "Jig desconectado" : "Jig conectado";

            // Determina o status do Usuário
            string userStatus = statusUser == 0 ? "Usuário desconectado" : "Usuário conectado";

            // Retorna os dados formatados com o personId, jig e usuário
            return Ok(new
            {
                PersonId = personId,
                Jig = new
                {
                    jig.ID,
                    jig.Name,
                    jig.SerialNumberJig,
                    Status = jigStatus
                },
                User = new
                {
                    user.ID,
                    user.Name,
                    user.Badge,
                    user.Created,
                    user.LastUpdated,
                    Status = userStatus
                }
            });
        }

        /// <summary>
        /// Buscar todos operadores com imagem
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores com imagem.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("ListUsersImages")]
        public async Task<ActionResult> GetAllUsersImage([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var (result, statusCode) = await _biometricService.GetAllUsersImageAsync(page, pageSize);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar todos operadores sem imagem
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores sem imagem.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,tecnico")]
        [HttpGet]
        [Route("ListUsersNoImage")]
        public async Task<ActionResult> GetAllUsersNoImage([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var (result, statusCode) = await _biometricService.GetAllUsersNoImageAsync(page, pageSize);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Buscar operadores pelo badge
        /// </summary>
        /// <response code="200">Retorna dados de operadores.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,tecnico")]
        [HttpGet("Badge")]
        public async Task<IActionResult> GetByBadge(string badge)
        {
            var response = await _biometricService.GetUserByBadgeAsync(badge);
            return Ok(response);
        }

        /// <summary>
        /// Cadastra e Atualiza dados do operador.
        /// </summary>
        /// <remarks>Cadastra o operador na base de dados; Para atualizar dados basta usar a matricula do operador.</remarks>
        /// <param name="biometric">Dados de cadastro do operador</param>
        /// <response code="200">Dados atualizados com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [HttpPost("adicionar")]
        [Authorize(Roles = "administrador,tecnico")]
        public async Task<IActionResult> InsertBiometric([FromForm] BiometricModel biometric)
        {
            var (result, statusCode) = await _biometricService.ManageOperatorAsync(biometric);
            return StatusCode(statusCode, result);
        }


        /// <summary>
        /// Buscar operador pelo ID
        /// </summary>
        /// <param name="id">ID do operador</param>
        /// <response code="200">Retorna dados do operador.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [HttpGet("operador/{id}")]
        [Authorize(Roles = "administrador,tecnico")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var response = await _biometricService.GetUserByIdAsync(id);
            return Ok(response);
        }

        //[HttpGet("embedding")]
        //public async Task<IActionResult> GetEmbedding(string embeding)
        //{
        //    var response = await _biometricService.GetEmbedding(embeding);
        //    return Ok(response);
        //}

        /// <summary>
        /// Deleta operador pelo ID
        /// </summary>
        /// <param name="id">ID do operador</param>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "administrador,tecnico")]
        public async Task<IActionResult> DeleteBiometric(int id)
        {
            var (result, statusCode) = await _biometricService.DeleteUserByIdAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
