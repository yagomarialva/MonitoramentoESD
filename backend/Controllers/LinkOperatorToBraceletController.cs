using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LinkOperatorToBraceletController : Controller
    {
        private readonly LinkOperatorToBraceletService _service;
        public LinkOperatorToBraceletController(ILinkOperatorToBraceletRepository linkOperatorToBracelet)
        {
            _service = new LinkOperatorToBraceletService(linkOperatorToBracelet);
        }

        [HttpGet]
        [Route("/buscarLinks")]
        public async Task<ActionResult> BuscarTodosLinks()
        {
            await _service.GetAllLinks();
            return Ok();
        }

        [HttpGet]
        [Route("/linkById{id}")]
        public async Task<ActionResult> BuscarId(int id)
        {
            await _service.GetLinkOperatorToBraceletId(id);
            return Ok(id);
        }

        [HttpGet]
        [Route("/linkByUserId{id}")]
        public async Task<ActionResult> BuscarLinkUserId(int id)
        {
            await _service.GetLinkOperatorToUserID(id);
            return Ok(id);
        }

        [HttpPost]
        [Route("/adicionarLink")]
        public async Task<ActionResult> Include(LinkOperatorToBraceletModel model)
        {
            await _service.Include(model);
            return Ok(model);
        }

        [HttpPost]
        [Route("/updateLink")]
        public async Task<ActionResult> Update(LinkOperatorToBraceletModel model, int id)
        {
            await _service.Update(model, id);
            return Ok();
        }

        [HttpDelete]
        [Route("/deleteLink")]
        public async Task<ActionResult> Delete(int id)
        {
            await _service.Delete(id);
            return Ok(id);

        }
    }
}
