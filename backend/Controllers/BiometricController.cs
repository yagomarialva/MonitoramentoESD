using BiometricFaceApi.Models;
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


        public BiometricController(UserService userService,
                                ImageService imageService,
                                BiometricService biometricService, JigService jigRepository)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _imageService = imageService ?? throw new ArgumentNullException(nameof(imageService));
            _biometricService = biometricService ?? throw new ArgumentNullException(nameof(biometricService));
            _jigRepository =  jigRepository ?? throw new ArgumentNullException(nameof(jigRepository));
        }

        /// <summary>
        /// Buscar todos operadores.
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores com imagem.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("ListUsersPaginated")]
        public async Task<ActionResult> GetUsersPaginated([FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var (result, statusCode) = await _biometricService.GetUsersPaginatedAsync(page, pageSize);
            return StatusCode(statusCode, result);
            
        }

       // [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost("verify-jig")]
        public async Task<IActionResult> VerifyJigAndFace( IFormFile imageFile,string serialNumber)
        {
            var (photo, personId, jig) = await _biometricService.Verify(imageFile, serialNumber);

            if (personId == 0 || jig == null)
            {
                return NotFound(new { message = "Jig não encontrado ou falha no reconhecimento facial." });
            }

            return Ok(new
            {
                PersonId = personId,
                Photo = photo, // Exemplo, pode ser a string Base64 da foto
                Jig = new
                {
                    jig.ID,
                    jig.Name,
                    jig.SerialNumber
                }
            });
        }


        /// <summary>
        /// Buscar todos operadores com imagem
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores com imagem.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
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
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
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
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
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
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
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
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var response = await _biometricService.GetUserByIdAsync(id);
            return Ok(response);
        }

        /// <summary>
        /// Deleta operador pelo ID
        /// </summary>
        /// <param name="id">ID do operador</param>
        /// <response code="200">Remove dados do banco de dados.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response code="500">Erro do servidor interno!</response>
        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        public async Task<IActionResult> DeleteBiometric(int id)
        {
            var (result, statusCode) = await _biometricService.DeleteUserByIdAsync(id);
            return StatusCode(statusCode, result);
        }
    }
}
