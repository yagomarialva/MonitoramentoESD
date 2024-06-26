using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BraceletAttributeController : Controller
    {

        private readonly BraceletAttributeService _braceletAttributeService;
        public BraceletAttributeController(IBraceletAttributeRepository braceletAttributeRepository)
        {
            _braceletAttributeService = new BraceletAttributeService(braceletAttributeRepository);
        }

        [HttpGet]
        [Route("/todos/")]
        public async Task<ActionResult> Buscartodos()
        {
            await _braceletAttributeService.GetAllAttributes();
            return Ok();
        }

        [HttpGet]
        [Route("/atributo/{id}")]
        public async Task<ActionResult> BuscarAtributo(int id)
        {
            await _braceletAttributeService.GetByAttibeById(id);
            return Ok();
        }

        [HttpGet]
        [Route("/property/{name}")]
        public async Task<ActionResult> BuascarAtributo(string name)
        {
            await _braceletAttributeService.GetByPropertyName(name);
            return Ok();
        }

        [HttpPost]
        [Route("/createAttribute")]
        public async Task<ActionResult> Include([FromForm] BraceletAttributeModel model)
        {
            await   _braceletAttributeService.Include(model);
            return Ok();
        }
        [HttpPost]
        [Route("/alterarAtributte/{id}")]
        public async Task<ActionResult> Update([FromForm] BraceletAttributeModel model, int id)
        {
            await _braceletAttributeService.Update(model, id);
            return Ok(model);
        }

        [HttpDelete]
        [Route("/delete")]
        public async Task<ActionResult> Delete(int id)
        {
            await _braceletAttributeService.Delete(id);
            return Ok();
        }
    }

}
