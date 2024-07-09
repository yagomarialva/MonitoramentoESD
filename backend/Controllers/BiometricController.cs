using Microsoft.AspNetCore.Mvc;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Identity;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net;
using MySqlX.XDevAPI.Common;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel;
using Org.BouncyCastle.Asn1.Crmf;



namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BiometricController : ControllerBase
    {

        protected readonly UserService _userService;
        protected readonly ImageService _imageService;
        protected readonly BiometricService _biometricService;
        protected readonly RolesService _rolesService;

       
        
        public BiometricController(IUsersRepository usersRepository, IImageRepository imageRepository, IRolesRepository rolesRepository)
        {
            _userService = new UserService(usersRepository);
            _imageService = new ImageService(imageRepository);
            _rolesService = new RolesService(rolesRepository);
            _biometricService = new BiometricService(_userService, _imageService, _rolesService);
 
           
        }
        /// <summary>
        /// Buscar todos operadores
        /// </summary>
        /// <response code="200">Retorna dados de todos operadores.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas</response>
        /// <response  code="500">Erro do servidor interno!</response>
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpGet]
        [Route("/todosUsers")]
        public async Task<ActionResult> GetAllUsers()
        {
            return Ok(await _biometricService.GetAllUsers());
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
        //[Authorize(Roles = "Admin,Standard,Developer")]
        [HttpPost]
        [Route("/adicionar")]
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
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpGet]
        [Route("/operador/{id}")]
        public async Task<ActionResult> GetUserById(int id)
        {
            var (response, statusCode) = await _biometricService.GetUserById(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(response, options);
            return StatusCode(statusCode, jsonResponse);
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
        [Authorize(Roles = "Admin,Operator,Developer")]
        [HttpDelete]
        [Route("/delete/{id}")]
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
