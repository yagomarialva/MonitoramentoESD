using BiometricFaceApi.Models;
using BiometricFaceApi.Security;
using Microsoft.EntityFrameworkCore;


namespace BiometricFaceApi.Data
{
    public class BiometricFaceDBContex : DbContext
    {

        private readonly SecurityService _securityService;
        private readonly IConfiguration _appSettings;
        public BiometricFaceDBContex(DbContextOptions<BiometricFaceDBContex> options, SecurityService securityService, IConfiguration appSettings) : base(options)
        {
            _securityService = securityService;
            _appSettings = appSettings;
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ImageModel> Images { get; set; }
        public DbSet<AuthenticationModel> Authentications { get; set; }
        public DbSet<MonitorEsdModel> MonitorEsds { get; set; }
        public DbSet<LogMonitorEsdModel> LogMonitorEsd { get; set; }
        public DbSet<ProduceActivityModel> ProduceActivity { get; set; }
        public DbSet<JigModel> Jigs { get; set; }
        public DbSet<RecordStatusProduceModel> RecordStatusProduce { get; set; }
        public DbSet<RolesModel> Roles { get; set; }
        public DbSet<StationModel> Station { get; set; }
        public DbSet<StationViewModel> StationViews { get; set; }
        public DbSet<LineModel> lineModels { get; set; }
        public DbSet<LinkStationAndLineModel> LinkStationAndLines { get; set; }
    }
}
