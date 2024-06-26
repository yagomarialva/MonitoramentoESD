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
            await _activityDetailsService.GetAllActivityDetails();
            return Ok();
        }

        [HttpGet]
        [Route("/buscarAtividade/{id}")]
        public async Task<ActionResult> BuscarAtividade(int id)
        {
            await _activityDetailsService.GetActivityDetailsId(id);
            return Ok();
        }

        [HttpGet]
        [Route("/buscarProducao/{id}")]
        public async Task<ActionResult> BuscarProducaoId(int id)
        {
            await _activityDetailsService.GetProduceActivityId(id);
            return Ok();
        }

        [HttpGet]
        [Route("/buscarAtividadePorDescricao/{description}")]
        public async Task<ActionResult> BuscarAtividadePorDescricaoId(string description)
        {
            await _activityDetailsService.GetProduceActivityDes(description);
            return Ok();
        }
        [HttpPost]
        [Route("/adicionarAtividade")]
        public async Task<ActionResult> Include(ActivityDetailsModel model)
        {
            await _activityDetailsService.Include(model);
            return Ok();
        }
        [HttpPost]
        [Route("/alterarAtividade")]
        public async Task<ActionResult> Update(ActivityDetailsModel model)
        {
            await _activityDetailsService.Update(model);
            return Ok();
        }
        [HttpGet]
        [Route("/deleteAtividade/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _activityDetailsService.Delete(id);
            return Ok();
        }
    }
}
