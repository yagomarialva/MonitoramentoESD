using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivityDetailsController : Controller
    {
        private readonly ActivityDetailsService _activityDetailsService;
        public ActivityDetailsController(IActivityDetailsRepository activityDetailsRepository)
        {
            _activityDetailsService = new ActivityDetailsService(activityDetailsRepository);
        }

        [HttpGet]
        [Route("/buscarTodas")]
        public async Task<ActionResult> BuscarTodas()
        {
            var list = await _activityDetailsService.GetAllActivityDetails();
            return Ok(list);
        }

        [HttpGet]
        [Route("/buscarAtividade/{id}")]
        public async Task<ActionResult> BuscarAtividade(int id)
        {
            var item = await _activityDetailsService.GetActivityDetailsId(id);
            return Ok(item);
        }

        [HttpGet]
        [Route("/buscarProducao/{id}")]
        public async Task<ActionResult> BuscarProducaoId(int id)
        {
            var item = await _activityDetailsService.GetProduceActivityId(id);
            return Ok(item);
        }

        [HttpGet]
        [Route("/buscarAtividadePorDescricao/{description}")]
        public async Task<ActionResult> BuscarAtividadePorDescricaoId(string description)
        {
            var item = await _activityDetailsService.GetProduceActivityDes(description);
            return Ok(item);
        }
        [HttpPost]
        [Route("/adicionarAtividade")]
        public async Task<ActionResult> Include(ActivityDetailsModel model)
        {
            var include = await _activityDetailsService.Include(model);
            return Ok(include);
        }
        [HttpPost]
        [Route("/alterarAtividade")]
        public async Task<ActionResult> Update(ActivityDetailsModel model)
        {
            var update = await _activityDetailsService.Update(model);
            return Ok(update);
        }
        [HttpGet]
        [Route("/deleteAtividade/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var delete = await _activityDetailsService.Delete(id);
            return Ok(delete);
        }
    }
}
