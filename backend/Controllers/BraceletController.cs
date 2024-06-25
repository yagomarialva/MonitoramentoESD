using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            await _braceletService.GetAllBracelets();
            return Ok();
        }
        [HttpGet]
        [Route("/braceletsById/{id}")]
        public async Task<ActionResult> BuscarId(int id)
        {
            await _braceletService.GetBraceletId(id);
            return Ok();
        }
        [HttpGet]
        [Route("/braceletBySn/{sn}")]
        public async Task<ActionResult> BuscarSn(string sn)
        {
            await _braceletService.GetBraceletSn(sn);
            return Ok();
        }
        [HttpPost]
        [Route("/adicionarbracelet")]
        public async Task<ActionResult> Include(BraceletModel model)
        {
            await _braceletService.Include(model);
            return Ok();
        }
        [HttpDelete]
        [Route("deleteBracelet")]
        public async Task<ActionResult> Delete(int id)
        {
            await _braceletService.Delete(id);
            return Ok();
        }
    }

}
