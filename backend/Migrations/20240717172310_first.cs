using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BiometricFaceApi.Migrations
{
    /// <inheritdoc />
    public partial class first : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "authentication",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "longtext", nullable: true),
                    RolesName = table.Column<string>(type: "longtext", nullable: true),
                    Badge = table.Column<string>(type: "varchar(255)", nullable: true),
                    Password = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_authentication", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jig",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jig", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "monitorEsd",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    SerialNumber = table.Column<string>(type: "varchar(255)", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_monitorEsd", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RolesName = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "station",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Badge = table.Column<string>(type: "varchar(255)", nullable: true),
                    Born = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "stationView",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    JigId = table.Column<int>(type: "int", nullable: false),
                    StationId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stationView", x => x.Id);
                    table.ForeignKey(
                        name: "FK_stationView_jig_JigId",
                        column: x => x.JigId,
                        principalTable: "jig",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_stationView_station_StationId",
                        column: x => x.StationId,
                        principalTable: "station",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "images",
                columns: table => new
                {
                    IdImage = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PictureStream = table.Column<byte[]>(type: "longblob", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_images", x => x.IdImage);
                    table.ForeignKey(
                        name: "FK_images_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "produceActivity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    JigId = table.Column<int>(type: "int", nullable: false),
                    MonitorEsdId = table.Column<int>(type: "int", nullable: false),
                    StationId = table.Column<int>(type: "int", nullable: false),
                    IsLocked = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    DataTimeMonitorEsdEvent = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produceActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_produceActivity_jig_JigId",
                        column: x => x.JigId,
                        principalTable: "jig",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_monitorEsd_MonitorEsdId",
                        column: x => x.MonitorEsdId,
                        principalTable: "monitorEsd",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_station_StationId",
                        column: x => x.StationId,
                        principalTable: "station",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "recordStatusProduce",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ProduceActivityId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    Status = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    DateEvent = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recordStatusProduce", x => x.Id);
                    table.ForeignKey(
                        name: "FK_recordStatusProduce_produceActivity_ProduceActivityId",
                        column: x => x.ProduceActivityId,
                        principalTable: "produceActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_recordStatusProduce_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "authentication",
                columns: new[] { "Id", "Badge", "Password", "RolesName", "Username" },
                values: new object[] { 1, "ADM", "inNWbDieA4KNSwWeLzW1cQ==", "administrator", "admin" });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "Id", "RolesName" },
                values: new object[,]
                {
                    { 1, "administrator" },
                    { 2, "developer" },
                    { 3, "operator" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_authentication_Badge",
                table: "authentication",
                column: "Badge",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_images_UserId",
                table: "images",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_jig_Name",
                table: "jig",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_monitorEsd_SerialNumber",
                table: "monitorEsd",
                column: "SerialNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_JigId",
                table: "produceActivity",
                column: "JigId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_MonitorEsdId",
                table: "produceActivity",
                column: "MonitorEsdId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_StationId",
                table: "produceActivity",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_UserId",
                table: "produceActivity",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_recordStatusProduce_ProduceActivityId",
                table: "recordStatusProduce",
                column: "ProduceActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_recordStatusProduce_UserId",
                table: "recordStatusProduce",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_stationView_JigId",
                table: "stationView",
                column: "JigId");

            migrationBuilder.CreateIndex(
                name: "IX_stationView_StationId",
                table: "stationView",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Badge",
                table: "users",
                column: "Badge",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "authentication");

            migrationBuilder.DropTable(
                name: "images");

            migrationBuilder.DropTable(
                name: "recordStatusProduce");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "stationView");

            migrationBuilder.DropTable(
                name: "produceActivity");

            migrationBuilder.DropTable(
                name: "jig");

            migrationBuilder.DropTable(
                name: "monitorEsd");

            migrationBuilder.DropTable(
                name: "station");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
