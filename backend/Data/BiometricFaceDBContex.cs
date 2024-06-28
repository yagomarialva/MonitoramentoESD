﻿using BiometricFaceApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BiometricFaceApi.Data
{
    public class BiometricFaceDBContex : DbContext
    {
        public BiometricFaceDBContex(DbContextOptions<BiometricFaceDBContex> options) : base(options) { }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ImageModel> Images { get; set; }
        public DbSet<AuthenticationModel> Auths { get; set; }
        public DbSet<BraceletModel> Bracelet { get; set; }
        public DbSet<BraceletAttributeModel> BraceletAttrib { get; set; }
        public DbSet<MonitorEsdModel> MonitorEsds { get; set; }
        public DbSet<ProduceActivityModel> ProduceActivity { get; set; }
        public DbSet<StationModel> Station { get; set; }
    }
}
