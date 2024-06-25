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

                    b.Property<string>("Login")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Badge")
                        .IsUnique();

                    b.ToTable("Auths");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.BraceletAttributeModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("BraceletId")
                        .HasColumnType("int");

                    b.Property<string>("Property")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("BraceletId");

                    b.HasIndex("Property")
                        .IsUnique();

                    b.ToTable("BraceletsAtrribute");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.BraceletModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Sn")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Bracelets");
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

                    b.ToTable("Images");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.LinkOperatorToBraceletModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("BraceletId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DatatimeEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BraceletId");

                    b.HasIndex("UserId");

                    b.ToTable("LinkOperatorToBracelet");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.MonitorEsdModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Descrition")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("MonitorEsd");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("BraceletId")
                        .HasColumnType("int");

                    b.Property<DateTime>("DatatimeEvent")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("EventId")
                        .HasColumnType("int");

                    b.Property<int>("MonitorEsdId")
                        .HasColumnType("int");

                    b.Property<int>("StationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BraceletId");

                    b.HasIndex("EventId");

                    b.HasIndex("StationId");

                    b.HasIndex("UserId");

                    b.ToTable("ProduceActivity");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationAttributeModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Property")
                        .HasColumnType("longtext");

                    b.Property<int>("StationId")
                        .HasColumnType("int");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("StationAtttib");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.StationModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Station");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.UserModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Badge")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Badge")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.BraceletAttributeModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.BraceletModel", "Bracelet")
                        .WithMany()
                        .HasForeignKey("BraceletId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bracelet");
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

            modelBuilder.Entity("BiometricFaceApi.Models.LinkOperatorToBraceletModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.BraceletModel", "Bracelet")
                        .WithMany()
                        .HasForeignKey("BraceletId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.UserModel", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bracelet");

                    b.Navigation("User");
                });

            modelBuilder.Entity("BiometricFaceApi.Models.ProduceActivityModel", b =>
                {
                    b.HasOne("BiometricFaceApi.Models.BraceletModel", "Bracelet")
                        .WithMany()
                        .HasForeignKey("BraceletId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("BiometricFaceApi.Models.MonitorEsdModel", "Event")
                        .WithMany()
                        .HasForeignKey("EventId");

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

                    b.Navigation("Bracelet");

                    b.Navigation("Event");

                    b.Navigation("Station");

                    b.Navigation("User");
                });
#pragma warning restore 612, 618
        }
    }
}
