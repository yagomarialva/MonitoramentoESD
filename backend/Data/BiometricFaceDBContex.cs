using BiometricFaceApi.Models;
using BiometricFaceApi.Security;
using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;


namespace BiometricFaceApi.Data
{
    public class BiometricFaceDBContex : DbContext
    {

        private readonly SecurityService securityService;
        public BiometricFaceDBContex(DbContextOptions<BiometricFaceDBContex> options, SecurityService securityService) : base(options)
        {
            this.securityService = securityService;
        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ImageModel> Images { get; set; }
        public DbSet<AuthenticationModel> Auths { get; set; }
        public DbSet<MonitorEsdModel> MonitorEsds { get; set; }
        public DbSet<ProduceActivityModel> ProduceActivity { get; set; }
        public DbSet<JigModel> Jigs { get; set; }
        public DbSet<RecordStatusProduceModel> RecordStatusProduce { get; set; }
        public DbSet<RolesModel> Roles { get; set; }
        public DbSet<StationModel> Station { get; set; }
        public DbSet<StationViewModel> StationViews { get; set; }
        public DbSet<LineModel> lineModels { get; set; }
        public DbSet<PositionModel> Position { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RolesModel>().Property(p => p.RolesName).IsRequired();
            modelBuilder.Entity<RolesModel>().HasData(new RolesModel[]
            {
                new RolesModel
                {ID=1,
                   RolesName = "administrator"
                },
                 new RolesModel
                {ID =2,
                   RolesName = "developer"
                },
                 new RolesModel {
                     ID=3,
                     RolesName = "operator"
                 }
            });
            modelBuilder.Entity<AuthenticationModel>().HasData(new AuthenticationModel[]
            {
                new AuthenticationModel
                {ID=1,
                    Username = "admin",
                    Badge = "ADM",
                    RolesName = "administrator",
                    Password = securityService.EncryptAES("admcompal")
                }
            });

        }
    }
}
