using BiometricFaceApi.Models;
using Microsoft.AspNetCore.Identity;

namespace BiometricFaceApi.Services
{
    public class ManagerEsdService
    {
        protected readonly BraceletService _braceletService;
        protected readonly BraceletAttributeService _attrBraceletService;
        protected readonly MonitorEsdService _monitorEsdService;
        protected readonly ProduceActivityService _produceActivityService;
        protected readonly StationService _stationService;
        protected readonly UserService _userService;


        public ManagerEsdService(BraceletService braceletService, BraceletAttributeService braceletAttributeService, MonitorEsdService monitorEsdService, ProduceActivityService produceActivityService, StationService stationService, UserService userService)
        {
            _braceletService = braceletService;
            _attrBraceletService = braceletAttributeService;
            _monitorEsdService = monitorEsdService;
            _produceActivityService = produceActivityService;
            _stationService = stationService;
            _userService = userService;
        }


        public async Task<(object?, int)> ManagerEsd(ManagerEsdModel model)
        {
            object? content;
            int statusCode;
            try
            {
                var user = new UserModel { Badge = model.Badge, Name = model.NameUser };
                var bracelet = new BraceletModel { Sn = model.Sn };
                var attbracelet = new BraceletAttributeModel { Property = model.Property, Value = model.Value };
                var monitor = new MonitorEsdModel { Name = model.NameMonitor, Descrition = model.Descrition };
                var produce = new ProduceActivityModel { UserId = user.Id, BraceletId = bracelet.Id, MonitorEsdId = monitor.Id };
                var repositoryUser = await _userService.GetUserByBadge(model.Badge);
                if (repositoryUser.Id > 0)
                {
                    //update

                    bracelet.Id = repositoryUser.Id;
                    attbracelet.AttributeId = repositoryUser.Id;
                    monitor.Id = repositoryUser.Id;
                    produce.Id = repositoryUser.Id;
                    await _userService.Update(user, repositoryUser.Id);
                    await _braceletService.Include(bracelet);
                    await _attrBraceletService.Update(attbracelet, bracelet.Id);
                    await _monitorEsdService.Include(monitor);
                    await _produceActivityService.Include(produce);

                    var update = new ManagerEsdModel
                    {
                        Id = model.Id,
                        NameUser = model.NameUser,
                        Badge = model.Badge,
                        Property = model.Property,
                        Value = model.Value,
                        Sn = model.Sn,
                        NameMonitor = model.NameMonitor,
                        Descrition = model.Descrition,
                        NameStation = model.NameStation,
                        Produce = model.Produce,

                    };
                    content = update;
                    statusCode = StatusCodes.Status200OK;
                    return (content, statusCode);
                }
                else
                {
                    if (string.IsNullOrEmpty(user.Name))
                    {
                        throw new Exception("O nome do usuário não pode ser nulo");
                    }
                    if (string.IsNullOrEmpty(user.Badge))
                    {
                        throw new Exception("O identificador do usuário não pode ser nulo");
                    }

                    //include
                    var newProduce = await _userService.Include(user);
                    if (newProduce != null)
                    {
                        bracelet.Id = repositoryUser.Id;
                        attbracelet.AttributeId = repositoryUser.Id;
                        monitor.Id = repositoryUser.Id;
                        produce.Id = repositoryUser.Id;
                        await _userService.Include(user);
                        await _braceletService.Include(bracelet);
                        await _attrBraceletService.Include(attbracelet);
                        await _monitorEsdService.Include(monitor);
                        await _produceActivityService.Include(produce);

                        var include = new ManagerEsdModel
                        {
                            Id = model.Id,
                            NameUser = model.NameUser,
                            Badge = model.Badge,
                            Property = model.Property,
                            Value = model.Value,
                            Sn = model.Sn,
                            NameMonitor = model.NameMonitor,
                            Descrition = model.Descrition,
                            NameStation = model.NameStation,
                            Produce = model.Produce,
                        };
                        content = include;
                        statusCode = StatusCodes.Status200OK;
                    }
                    else
                    {
                        content = "Dados incorretos ou inválidos.";
                        statusCode = StatusCodes.Status404NotFound;
                    }
                }
            }
            catch (Exception ex)
            {
                content = ex.Message;
                statusCode = StatusCodes.Status500InternalServerError;

            }
            return (content, statusCode);
        }
    }
}
