using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class MonitorEsdController : Controller
    {
        private readonly MonitorEsdService _service;
        public MonitorEsdController(IMonitorEsdRepository monitorEsdRepository)
        {
            _service = new MonitorEsdService(monitorEsdRepository);
        }
        [HttpGet]
        [Route("/todosMonitores")]
       public async Task<ActionResult> BuscarTodos()
        {
            await _service.GetAllMonitorEsds();
            return Ok();
        }

        [HttpGet]
        [Route("/BuscarMonitores{id}")]
        public async Task<ActionResult> BuscarIdMonitor(int id)
        {
            await _service.GetMonitorId(id);
            return Ok(id);
        }

        [HttpPost]
        [Route("/adicioanr")]
        public async Task<ActionResult> Include(MonitorEsdModel model)
        {
            await _service.Include(model);
            return Ok(model);
        }

        [HttpDelete]
        [Route("")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok(id);
        }

    }
}
