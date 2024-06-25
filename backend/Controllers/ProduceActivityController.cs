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
            await _service.GetAllProduceAct();
            return Ok();
        }
        [HttpGet]
        [Route("/TodaProducaoId")]
        public async Task<ActionResult> BuscarTodaProducao(int id)
        {
            await _service.GetProduceId(id);
            return Ok();
        }

        [HttpPost]
        [Route("/adicionarProducao")]
        public async Task<ActionResult> Include([FromBody] ProduceActivityModel model)
        {
            await _service.Include(model);
            return Ok();
        }

        [HttpDelete]
        [Route("/DeleteProducao{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok();
        }



    }
}
