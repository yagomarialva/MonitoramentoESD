using BiometricFaceApi.Middleware;
using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using System.Text.Json;
using ZstdSharp.Unsafe;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BraceletController : Controller
    {
        private readonly BraceletService _braceletService;
        
        public BraceletController(IBraceletRepository braceletRepository)
        {
            _braceletService = new BraceletService(braceletRepository);
        }

        [HttpGet]
        [Route("/todosBracelets")]
        public async Task<ActionResult> BuscarTodosBracelets()
        {
            var list = await _braceletService.GetAllBracelets();
            return Ok(list);
        }
        [HttpGet]
        [Route("/braceletsById/{id}")]
        public async Task<ActionResult> BuscarId(int id)
        {
            var item = await _braceletService.GetBraceletId(id);
            return Ok(item);
        }
        [HttpGet]
        [Route("/braceletBySn/{sn}")]
        public async Task<ActionResult> BuscarSn(string sn)
        {
            var item = await _braceletService.GetBraceletSn(sn);
            return Ok(item);
        }
        [HttpPost]
        [Route("/gerenciarbracelet")]
        public async Task<ActionResult> Include(BraceletModel model)
        {

            var (response, statusCode) = await _braceletService.Include(model);
            return StatusCode(statusCode, response);
        }

        [HttpDelete]
        [Route("deleteBracelet/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var (result, statusCode) = await _braceletService.Delete(id);
            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonResponse = JsonSerializer.Serialize(result, options);
            var delete = await _braceletService.Delete(id);
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
