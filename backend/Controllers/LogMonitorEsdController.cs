﻿using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogMonitorEsdController : ControllerBase
    {
        private readonly LogMonitorEsdService _logMonitorEsdService;
        public LogMonitorEsdController(ILogMonitorEsdRepository logMonitorEsdRepository)
        {
            _logMonitorEsdService = new LogMonitorEsdService(logMonitorEsdRepository);
        }

        /// <summary>
        /// Busca um monitor ESD por ID.
        /// </summary>
        /// <param name="id">ID monitor ESD a ser buscado.</param>
        /// <returns>Retorna uma lista de informações solicitado.</returns>
        /// <response code="200">Retorna o ID encontrado com uma lista de informações.</response>
        /// <response code="404">Id não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("ListMonitorEsd")]
        public async Task<ActionResult> BuscarListaMonitorEsdById([FromQuery] int id, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetListMonitorEsdByIdAsync(id, page, pageSize);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca um log monitor ESD por ID.
        /// </summary>
        /// <param name="id">ID do log monitor ESD a ser buscado.</param>
        /// <returns>Retorna o log solicitado.</returns>
        /// <response code="200">Retorna o log encontrado.</response>
        /// <response code="404">log não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("logbyid{id}")]
        public async Task<ActionResult> BuscarLogMonitorById(int id)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetByIdAsync(id);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca tipo de log de um monitor ESD.
        /// </summary>
        /// <param name="type">Identificação dos tipo de log a serem buscados.</param>
        /// <returns>Retorna os logs solicitados.</returns>
        /// <response code="200">Retorna o tipo de log encontrados.</response>
        /// <response code="404">Nenhum monitor encontrado com o tipo de log fornecido.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("type/{type}")]
        public async Task<ActionResult> BuscarMessageType(string type)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetMessageTypeAsync(type);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca tipo de conteudo log de um monitor ESD.
        /// </summary>
        /// <param name="content">Identificação dos tipo de conteudo de log a serem buscados.</param>
        /// <returns>Retorna os logs solicitados.</returns>
        /// <response code="200">Retorna o tipo de conteudo de log encontrados.</response>
        /// <response code="404">Nenhum monitor encontrado com o tipo de conteudo de log fornecido.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("/{content}")]
        public async Task<ActionResult> BuscarMessageContent(string content)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetMessageContentAsync(content);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca um monitor ESD por ID.
        /// </summary>
        /// <param name="id">ID monitor ESD a ser buscado.</param>
        /// <returns>Retorna o log solicitado.</returns>
        /// <response code="200">Retorna o ID encontrado.</response>
        /// <response code="404">Id não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult> BuscarMonitorEsdById(int id)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetMonitorEsdByIdAsync(id);
            return StatusCode(statusCode, result);
        }
        /// <summary>
        /// Busca um monitor ESD por IP.
        /// </summary>
        /// <param name="ip">IP monitor ESD a ser buscado.</param>
        /// <returns>Retorna o log solicitado.</returns>
        /// <response code="200">Retorna o IP encontrado.</response>
        /// <response code="404">IP não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("ip{ip}")]
        public async Task<ActionResult> BuscarMonitorEsdByIP(string ip)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetMonitorEsdByIPAsync(ip);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Busca um monitor ESD por Serial Number.
        /// </summary>
        /// <param name="serialNumber"> monitor ESD a ser buscado.</param>
        /// <returns>Retorna o log solicitado.</returns>
        /// <response code="200">Retorna o Serial Number encontrado.</response>
        /// <response code="404">Serial Number não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpGet]
        [Route("sn{serialNumber}")]
        public async Task<ActionResult> BuscarMonitorEsdById(string serialNumber)
        {
            var (result, statusCode) = await _logMonitorEsdService.GetMonitorEsdBySnAsync(serialNumber);
            return StatusCode(statusCode, result);
        }

        /// <summary>
        /// Cadastra ou atualiza dados de um log.
        /// </summary>
        /// <param name="model">Dados de um log a serem cadastrados ou atualizados.</param>
        /// <returns>Retorna o resultado da operação.</returns>
        /// <response code="200">Dados atualizados com sucesso.</response>
        /// <response code="201">Dados cadastrados com sucesso.</response>
        /// <response code="400">Dados incorretos ou inválidos.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico,esp32")]
        [HttpPost]
        [Route("ManagerLogs")]
        public async Task<ActionResult> ManagerLogsMonitorEsd([FromBody] LogMonitorEsdModel model)
        {
            var (result, statusCode) = await _logMonitorEsdService.AddOrUpdateAsync(model);
            return StatusCode(statusCode, result);
        }

        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpPost]
        [Route("changeLogs")]
        public async Task<IActionResult> ChangesLogsMonitorEsd(int id, bool changeLogs, string? description)
        {
            var (result, statusCode) = await _logMonitorEsdService.ChangeStatusLog(id, changeLogs, description);
            return StatusCode(statusCode, result);
        }


        /// <summary>
        /// Deleta log de  monitor ESD pelo ID.
        /// </summary>
        /// <param name="id">ID do log a ser deletado.</param>
        /// <returns>Resultado da operação.</returns>
        /// <response code="200">log deletado com sucesso.</response>
        /// <response code="404">log não encontrado.</response>
        /// <response code="401">Acesso negado devido a credenciais inválidas.</response>
        /// <response code="500">Erro do servidor interno.</response>
        [Authorize(Roles = "administrador,desenvolvedor,tecnico")]
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _logMonitorEsdService.Delete(id);
            return StatusCode(statusCode, result);
        }

    }
}
