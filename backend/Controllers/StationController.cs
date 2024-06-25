using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StationController : Controller
    {
        private readonly StationService _service;
        public StationController(IStationRepository stationRepository)
        {
            _service = new StationService(stationRepository);
        }

        [HttpGet]
        [Route("/todasStations")]
        public async Task<ActionResult> BuscarTodasStations()
        {
            await _service.GetAllStation();
            return Ok();
        }

        [HttpGet]
        [Route("/buscarStationId{id}")]
        public async Task<ActionResult> BuscarStationId(int id)
        {
            await _service.GetStationId(id);
            return Ok();
        }

        [HttpPost]
        [Route("/adicionarStation")]
        public async Task<ActionResult> Include(StationModel model)
        {
            await _service.Include(model);
            return Ok();
        }

        [HttpDelete]
        [Route("/deleteSation")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok();
        }
    }
}
