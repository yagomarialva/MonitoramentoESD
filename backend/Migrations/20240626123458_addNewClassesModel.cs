using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace BiometricFaceApi.Migrations
{
    /// <inheritdoc />
    public partial class addNewClassesModel : Migration
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
                    Login = table.Column<string>(type: "longtext", nullable: true),
                    Badge = table.Column<string>(type: "varchar(255)", nullable: true),
                    Password = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_authentication", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "bracelets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Sn = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bracelets", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "monitorEsd",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Descrition = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_monitorEsd", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "station",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_station", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "stationAtttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    StationId = table.Column<int>(type: "int", nullable: false),
                    Property = table.Column<string>(type: "longtext", nullable: true),
                    Value = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stationAtttribute", x => x.Id);
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
                name: "braceletsAtrribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    BraceletId = table.Column<int>(type: "int", nullable: false),
                    Property = table.Column<string>(type: "varchar(255)", nullable: true),
                    Value = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_braceletsAtrribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_braceletsAtrribute_bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "bracelets",
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
                name: "linkOperatorToBracelet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BraceletId = table.Column<int>(type: "int", nullable: false),
                    DatatimeEvent = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_linkOperatorToBracelet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_linkOperatorToBracelet_bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "bracelets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_linkOperatorToBracelet_users_UserId",
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
                    BraceletId = table.Column<int>(type: "int", nullable: false),
                    StationId = table.Column<int>(type: "int", nullable: false),
                    MonitorEsdId = table.Column<int>(type: "int", nullable: false),
                    EventId = table.Column<int>(type: "int", nullable: true),
                    DatatimeEvent = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_produceActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_produceActivity_bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "bracelets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_produceActivity_monitorEsd_EventId",
                        column: x => x.EventId,
                        principalTable: "monitorEsd",
                        principalColumn: "Id");
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
                name: "activityDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ProduceActivityId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activityDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_activityDetails_produceActivity_ProduceActivityId",
                        column: x => x.ProduceActivityId,
                        principalTable: "produceActivity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_activityDetails_ProduceActivityId",
                table: "activityDetails",
                column: "ProduceActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_authentication_Badge",
                table: "authentication",
                column: "Badge",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_braceletsAtrribute_BraceletId",
                table: "braceletsAtrribute",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_braceletsAtrribute_Property",
                table: "braceletsAtrribute",
                column: "Property",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_images_UserId",
                table: "images",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_linkOperatorToBracelet_BraceletId",
                table: "linkOperatorToBracelet",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_linkOperatorToBracelet_UserId",
                table: "linkOperatorToBracelet",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_BraceletId",
                table: "produceActivity",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_EventId",
                table: "produceActivity",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_StationId",
                table: "produceActivity",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_produceActivity_UserId",
                table: "produceActivity",
                column: "UserId");

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
                name: "activityDetails");

            migrationBuilder.DropTable(
                name: "authentication");

            migrationBuilder.DropTable(
                name: "braceletsAtrribute");

            migrationBuilder.DropTable(
                name: "images");

            migrationBuilder.DropTable(
                name: "linkOperatorToBracelet");

            migrationBuilder.DropTable(
                name: "stationAtttribute");

            migrationBuilder.DropTable(
                name: "produceActivity");

            migrationBuilder.DropTable(
                name: "bracelets");

            migrationBuilder.DropTable(
                name: "monitorEsd");

            migrationBuilder.DropTable(
                name: "station");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
