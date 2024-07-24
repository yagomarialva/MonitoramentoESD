﻿// <auto-generated />
using System;
using BiometricFaceApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BiometricFaceApi.Migrations
{
    [DbContext(typeof(BiometricFaceDBContex))]
    [Migration("20240723184709_first")]
    partial class first
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BiometricFaceApi.Models.AuthenticationModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Badge")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Password")
                        .HasColumnType("longtext");

                    b.Property<string>("RolesName")
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("ID");

                    b.HasIndex("Badge")
                        .IsUnique();

                    b.ToTable("authentication");

                    b.HasData(
                        new
                        {
                            ID = 1,
                            Badge = "ADM",
                            Password = "inNWbDieA4KNSwWeLzW1cQ==",
                            RolesName = "administrator",
                            Username = "admin"
                        });
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ImageModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<byte[]>("PictureStream")
                        .HasColumnType("longblob");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("UserId");

                    b.ToTable("images");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.JigModel", b =>
                {
                    b.Property<int>("ID")
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

                    b.HasKey("ID");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("jig");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.LineModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("ID");

                    b.ToTable("line");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.MonitorEsdModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("DateHour")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("LastDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PositionId")
                        .HasColumnType("int");

                    b.Property<int>("PositionSequence")
                        .HasColumnType("int");

                    b.Property<string>("SerialNumber")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Status")
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("PositionId");

                    b.HasIndex("SerialNumber")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("monitorEsd");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.PositionModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("SizeX")
                        .HasColumnType("int");

                    b.Property<int>("SizeY")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.ToTable("position");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("DataTimeMonitorEsdEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsLocked")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("JigId")
                        .HasColumnType("int");

                    b.Property<int>("MonitorEsdId")
                        .HasColumnType("int");

                    b.Property<int>("StationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("JigId");

                    b.HasIndex("MonitorEsdId");

                    b.HasIndex("StationId");

                    b.HasIndex("UserId");

                    b.ToTable("produceActivity");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.RecordStatusProduceModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("DateEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("ProduceActivityId")
                        .HasColumnType("int");

                    b.Property<bool?>("Status")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("ProduceActivityId");

                    b.HasIndex("UserId");

                    b.ToTable("recordStatusProduce");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.RolesModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("RolesName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("ID");

                    b.ToTable("roles");

                    b.HasData(
                        new
                        {
                            ID = 1,
                            RolesName = "administrator"
                        },
                        new
                        {
                            ID = 2,
                            RolesName = "developer"
                        },
                        new
                        {
                            ID = 3,
                            RolesName = "operator"
                        });
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("LastUpdated")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("LineID")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("ID");

                    b.HasIndex("LineID");

                    b.ToTable("station");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationViewModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime?>("Created")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("JigId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("LastUpdated")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("StationId")
                        .HasColumnType("int");

                    b.HasKey("ID");

                    b.HasIndex("JigId")
                        .IsUnique();

                    b.HasIndex("StationId");

                    b.ToTable("stationView");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.UserModel", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Badge")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("Born")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.HasKey("ID");

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

            modelBuilder.Entity("BiometricFaceApi.Models.MonitorEsdModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.PositionModel", "Position")
                        .WithMany()
                        .HasForeignKey("PositionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Position");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.JigModel", "Jig")
                        .WithMany()
                        .HasForeignKey("JigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

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

                    b.Navigation("Jig");

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

            modelBuilder.Entity("BiometricFaceApi.Models.StationModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.LineModel", "Line")
                        .WithMany()
                        .HasForeignKey("LineID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Line");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationViewModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.JigModel", "Jig")
                        .WithMany()
                        .HasForeignKey("JigId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.StationModel", "Station")
                        .WithMany()
                        .HasForeignKey("StationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Jig");

                    b.Navigation("Station");
                });
#pragma warning restore 612, 618
        }
    }
}
