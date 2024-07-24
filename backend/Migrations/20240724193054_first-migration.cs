using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BiometricFaceApi.Migrations
{
    /// <inheritdoc />
    public partial class firstmigration : Migration
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
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "longtext", nullable: false),
                    RolesName = table.Column<string>(type: "longtext", nullable: true),
                    Badge = table.Column<string>(type: "varchar(255)", nullable: false),
                    Password = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_authentication", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "line",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_line", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "position",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    SizeX = table.Column<int>(type: "int", nullable: false),
                    SizeY = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_position", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RolesName = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "station",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false),
                    SizeX = table.Column<int>(type: "int", nullable: false),
                    SizeY = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Badge = table.Column<string>(type: "varchar(255)", nullable: true),
                    Born = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.ID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "jig",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    PositionID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jig", x => x.ID);
                    table.ForeignKey(
                        name: "FK_jig_position_PositionID",
                        column: x => x.PositionID,
                        principalTable: "position",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "linkStationAndLine",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    LineID = table.Column<int>(type: "int", nullable: false),
                    StationID = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_linkStationAndLine", x => x.ID);
                    table.ForeignKey(
                        name: "FK_linkStationAndLine_line_LineID",
                        column: x => x.LineID,
                        principalTable: "line",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_linkStationAndLine_station_StationID",
                        column: x => x.StationID,
                        principalTable: "station",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "images",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PictureStream = table.Column<byte[]>(type: "longblob", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_images", x => x.ID);
                    table.ForeignKey(
                        name: "FK_images_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "monitorEsd",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "varchar(255)", nullable: true),
                    PositionId = table.Column<int>(type: "int", nullable: false),
                    PositionSequence = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: true),
                    Description = table.Column<string>(type: "longtext", nullable: true),
                    DateHour = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_monitorEsd", x => x.ID);
                    table.ForeignKey(
                        name: "FK_monitorEsd_position_PositionId",
                        column: x => x.PositionId,
                        principalTable: "position",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_monitorEsd_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "produceActivity",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
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
                    table.PrimaryKey("PK_produceActivity", x => x.ID);
                    table.ForeignKey(
                        name: "FK_produceActivity_jig_JigId",
                        column: x => x.JigId,
                        principalTable: "jig",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_monitorEsd_MonitorEsdId",
                        column: x => x.MonitorEsdId,
                        principalTable: "monitorEsd",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_station_StationId",
                        column: x => x.StationId,
                        principalTable: "station",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "stationView",
                columns: table => new
                {
                    ID = table.Column<Guid>(type: "char(36)", nullable: false),
                    MonitorEsdId = table.Column<int>(type: "int", nullable: false),
                    LinkStationAndLineId = table.Column<int>(type: "int", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    LastUpdated = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stationView", x => x.ID);
                    table.ForeignKey(
                        name: "FK_stationView_linkStationAndLine_LinkStationAndLineId",
                        column: x => x.LinkStationAndLineId,
                        principalTable: "linkStationAndLine",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_stationView_monitorEsd_MonitorEsdId",
                        column: x => x.MonitorEsdId,
                        principalTable: "monitorEsd",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "recordStatusProduce",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ProduceActivityId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
                    Status = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    DateEvent = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recordStatusProduce", x => x.ID);
                    table.ForeignKey(
                        name: "FK_recordStatusProduce_produceActivity_ProduceActivityId",
                        column: x => x.ProduceActivityId,
                        principalTable: "produceActivity",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_recordStatusProduce_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "authentication",
                columns: new[] { "ID", "Badge", "Password", "RolesName", "Username" },
                values: new object[] { 1, "ADM", "inNWbDieA4KNSwWeLzW1cQ==", "administrator", "admin" });

            migrationBuilder.InsertData(
                table: "roles",
                columns: new[] { "ID", "RolesName" },
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
                name: "IX_jig_PositionID",
                table: "jig",
                column: "PositionID");

            migrationBuilder.CreateIndex(
                name: "IX_linkStationAndLine_LineID",
                table: "linkStationAndLine",
                column: "LineID");

            migrationBuilder.CreateIndex(
                name: "IX_linkStationAndLine_StationID",
                table: "linkStationAndLine",
                column: "StationID");

            migrationBuilder.CreateIndex(
                name: "IX_monitorEsd_PositionId",
                table: "monitorEsd",
                column: "PositionId");

            migrationBuilder.CreateIndex(
                name: "IX_monitorEsd_SerialNumber",
                table: "monitorEsd",
                column: "SerialNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_monitorEsd_UserId",
                table: "monitorEsd",
                column: "UserId");

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
                name: "IX_stationView_LinkStationAndLineId",
                table: "stationView",
                column: "LinkStationAndLineId");

            migrationBuilder.CreateIndex(
                name: "IX_stationView_MonitorEsdId",
                table: "stationView",
                column: "MonitorEsdId",
                unique: true);

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
                name: "linkStationAndLine");

            migrationBuilder.DropTable(
                name: "jig");

            migrationBuilder.DropTable(
                name: "monitorEsd");

            migrationBuilder.DropTable(
                name: "line");

            migrationBuilder.DropTable(
                name: "station");

            migrationBuilder.DropTable(
                name: "position");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
