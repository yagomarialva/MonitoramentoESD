using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controler]")]
    [ApiController]
    public class StationAttributeController : Controller
    {
        private readonly StationAttributeService _service;
        public StationAttributeController(IStationAttributeRepository stationAttributeRepository)
        {
            _service = new StationAttributeService (stationAttributeRepository);
        }

        [HttpGet]
        [Route("/buscarTodosAtributos")]
        public async Task<ActionResult> BuscarTodosAtributos()
        {
            await _service.GetAllStation();
            return Ok();
        }

        [HttpGet]
        [Route("/buscarAtributoI{id}")]
        public async Task<ActionResult> BuscarStationAtributosId(int id)
        {
            await _service.GetStationAttId(id);
            return Ok();
        }

        [HttpGet]
        [Route("/adicionarAtributoStation")]
        public async Task<ActionResult> Include (StationAttributeModel model)
        {
            await _service.Include(model);
            return Ok();
        }

    }
}
