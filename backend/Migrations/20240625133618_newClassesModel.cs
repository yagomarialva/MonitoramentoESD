using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace BiometricFaceApi.Migrations
{
    /// <inheritdoc />
    public partial class newClassesModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Bracelets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Sn = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bracelets", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MonitorEsd",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true),
                    Descrition = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonitorEsd", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Station",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Station", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StationAtttib",
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
                    table.PrimaryKey("PK_StationAtttib", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BraceletsAtrribute",
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
                    table.PrimaryKey("PK_BraceletsAtrribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BraceletsAtrribute_Bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "Bracelets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LinkOperatorToBracelet",
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
                    table.PrimaryKey("PK_LinkOperatorToBracelet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LinkOperatorToBracelet_Bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "Bracelets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LinkOperatorToBracelet_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProduceActivity",
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
                    table.PrimaryKey("PK_ProduceActivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProduceActivity_Bracelets_BraceletId",
                        column: x => x.BraceletId,
                        principalTable: "Bracelets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProduceActivity_MonitorEsd_EventId",
                        column: x => x.EventId,
                        principalTable: "MonitorEsd",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProduceActivity_Station_StationId",
                        column: x => x.StationId,
                        principalTable: "Station",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProduceActivity_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Images_UserId",
                table: "Images",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BraceletsAtrribute_BraceletId",
                table: "BraceletsAtrribute",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_BraceletsAtrribute_Property",
                table: "BraceletsAtrribute",
                column: "Property",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LinkOperatorToBracelet_BraceletId",
                table: "LinkOperatorToBracelet",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_LinkOperatorToBracelet_UserId",
                table: "LinkOperatorToBracelet",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProduceActivity_BraceletId",
                table: "ProduceActivity",
                column: "BraceletId");

            migrationBuilder.CreateIndex(
                name: "IX_ProduceActivity_EventId",
                table: "ProduceActivity",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_ProduceActivity_StationId",
                table: "ProduceActivity",
                column: "StationId");

            migrationBuilder.CreateIndex(
                name: "IX_ProduceActivity_UserId",
                table: "ProduceActivity",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Users_UserId",
                table: "Images",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Users_UserId",
                table: "Images");

            migrationBuilder.DropTable(
                name: "BraceletsAtrribute");

            migrationBuilder.DropTable(
                name: "LinkOperatorToBracelet");

            migrationBuilder.DropTable(
                name: "ProduceActivity");

            migrationBuilder.DropTable(
                name: "StationAtttib");

            migrationBuilder.DropTable(
                name: "Bracelets");

            migrationBuilder.DropTable(
                name: "MonitorEsd");

            migrationBuilder.DropTable(
                name: "Station");

            migrationBuilder.DropIndex(
                name: "IX_Images_UserId",
                table: "Images");
        }
    }
}
