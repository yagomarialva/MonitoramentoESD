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
           var list =  await _service.GetAllMonitorEsds();
            return Ok(list);
        }

        [HttpGet]
        [Route("/BuscarMonitores{id}")]
        public async Task<ActionResult> BuscarIdMonitor(int id)
        {
            var item = await _service.GetMonitorId(id);
            return Ok(item);
        }

        [HttpPost]
        [Route("/adicionarMonitor")]
        public async Task<ActionResult> Include(MonitorEsdModel model)
        {
            var include = await _service.Include(model);
            return Ok(include);
        }

        [HttpDelete]
        [Route("/deleteMonitor")]
        public async Task<ActionResult> Delete(int id)
        {
            var include = await _service.Delete(id);
            return Ok(include);
        }

    }
}
