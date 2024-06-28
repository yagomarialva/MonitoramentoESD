using BiometricFaceApi.Models;
using BiometricFaceApi.Repositories.Interfaces;
using BiometricFaceApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BiometricFaceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerEsdController : Controller
    {
        protected readonly BraceletService _braceletService;
        protected readonly BraceletAttributeService _attrBraceletService;
        protected readonly MonitorEsdService _monitorEsdService;
        protected readonly ProduceActivityService _produceActivityService;
        protected readonly StationService _stationService;
        protected readonly UserService _userService;
        protected readonly ManagerEsdService _managerEsdService;

        public ManagerEsdController(IBraceletAttributeRepository braceletAttributeRepository, IBraceletRepository braceletRepository, IMonitorEsdRepository monitorEsdRepository, IProduceActivityRepository produceActivityRepository, IStationRepository stationRepository, IUsersRepository usersRepository)
        {
            _braceletService = new BraceletService(braceletRepository);
            _attrBraceletService = new BraceletAttributeService(braceletAttributeRepository);
            _monitorEsdService = new MonitorEsdService(monitorEsdRepository);
            _produceActivityService = new ProduceActivityService(produceActivityRepository);
            _stationService = new StationService(stationRepository);
            _userService = new UserService(usersRepository);
            _managerEsdService = new ManagerEsdService(_braceletService, _attrBraceletService, _monitorEsdService, _produceActivityService, _stationService, _userService);
        }


        [HttpPost]
        [Route("/managerESD")]
        public async Task<ActionResult> Include([FromForm] ManagerEsdModel model)
        {
            var result = await _managerEsdService.ManagerEsd(model);
            return StatusCode(result.Item2, result.Item1);
        }


    }
}
