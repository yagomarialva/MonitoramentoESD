﻿// <auto-generated />
using System;
using BiometricFaceApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BiometricFaceApi.Migrations
{
    [DbContext(typeof(BiometricFaceDBContex))]
    partial class BiometricFaceDBContexModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BiometricFaceApi.Models.AuthenticationModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Badge")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Password")
                        .HasColumnType("longtext");

                    b.Property<string>("RolesName")
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Badge")
                        .IsUnique();

                    b.ToTable("authentication");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Badge = "ADM",
                            Password = "JYfUfqgr+5J2Pp3iBV2DFA==",
                            RolesName = "admin",
                            Username = "admin"
                        });
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ImageModel", b =>
                {
                    b.Property<int>("IdImage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<byte[]>("PictureStream")
                        .HasColumnType("longblob");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("IdImage");

                    b.HasIndex("UserId");

                    b.ToTable("images");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.MonitorEsdModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("SerialNumber")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("SerialNumber")
                        .IsUnique();

                    b.ToTable("monitorEsd");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("DatatimeMonitorEsdEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsLocked")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("MonitorEsdId")
                        .HasColumnType("int");

                    b.Property<int>("StationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("MonitorEsdId");

                    b.HasIndex("StationId");

                    b.HasIndex("UserId");

                    b.ToTable("produceActivity");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.RecordStatusProduceModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("DateEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<int>("ProduceActivityId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProduceActivityId");

                    b.HasIndex("UserId");

                    b.ToTable("recordStatusProduce");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.RolesModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("RolesName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("roles");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            RolesName = "admininstrator"
                        },
                        new
                        {
                            Id = 2,
                            RolesName = "developer"
                        },
                        new
                        {
                            Id = 3,
                            RolesName = "operator"
                        });
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("LastUpdated")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("station");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.UserModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Badge")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("Born")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<string>("RoleName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Badge")
                        .IsUnique();

                    b.ToTable("users");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ImageModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.MonitorEsdModel", "MonitorEsd")
                        .WithMany()
                        .HasForeignKey("MonitorEsdId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.StationModel", "Station")
                        .WithMany()
                        .HasForeignKey("StationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MonitorEsd");

                    b.Navigation("Station");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.RecordStatusProduceModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.ProduceActivityModel", "ProduceActivity")
                        .WithMany()
                        .HasForeignKey("ProduceActivityId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProduceActivity");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
