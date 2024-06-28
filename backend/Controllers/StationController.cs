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
            var list = await _service.GetAllStation();
            return Ok(list);
        }

        [HttpGet]
        [Route("/buscarStationId{id}")]
        public async Task<ActionResult> BuscarStationId(int id)
        {
            var item = await _service.GetStationId(id);
            return Ok(item);
        }

        [HttpPost]
        [Route("/gerenciarStation")]
        public async Task<ActionResult> Include(StationModel model)
        {
            var (response, statusCode) = await _service.Include(model);
            return StatusCode(statusCode, response);
        }

        [HttpDelete]
        [Route("/deleteSation/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var delete = await _service.Delete(id);
            return Ok(delete);
        }
    }
}
