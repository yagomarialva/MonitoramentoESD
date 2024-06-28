using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProduceActivityController : Controller
    {
        private readonly ProduceActivityService _service;
        public ProduceActivityController(IProduceActivityRepository produceActivityRepository)
        {
            _service = new ProduceActivityService(produceActivityRepository);
        }
        [HttpGet]
        [Route("/TodaProducao")]
        public async Task<ActionResult> BuscarTodaProducao()
        {
            var list = await _service.GetAllProduceAct();
            return Ok(list);
        }
        [HttpGet]
        [Route("/TodaProducaoId")]
        public async Task<ActionResult> BuscarTodaProducao(int id)
        {
            var item = await _service.GetProduceId(id);
            return Ok(item);
        }

        [HttpPost]
        [Route("/adicionarProducao")]
        public async Task<ActionResult> Include([FromBody] ProduceActivityModel model)
        {
            var include = await _service.Include(model);
            return Ok(include);
        }

        [HttpDelete]
        [Route("/DeleteProducao{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var delete = await _service.Delete(id);
            return Ok(delete);
        }



    }
}
