using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentProgressCriterias");

            migrationBuilder.DropTable(
                name: "ProgressCriteriaTypes");

            migrationBuilder.AddColumn<bool>(
                name: "IsIncreased",
                table: "StudentAttendances",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ProgressCriterionTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    EnglishName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VietnameseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressCriterionTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProgressCriteria",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    StudentNeedCareId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProgressCriteriaTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressCriteria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProgressCriteria_ProgressCriterionTypes_ProgressCriteriaTypeId",
                        column: x => x.ProgressCriteriaTypeId,
                        principalTable: "ProgressCriterionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProgressCriteria_StudentNeedCares_StudentNeedCareId",
                        column: x => x.StudentNeedCareId,
                        principalTable: "StudentNeedCares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProgressCriteria_ProgressCriteriaTypeId",
                table: "ProgressCriteria",
                column: "ProgressCriteriaTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgressCriteria_StudentNeedCareId",
                table: "ProgressCriteria",
                column: "StudentNeedCareId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProgressCriteria");

            migrationBuilder.DropTable(
                name: "ProgressCriterionTypes");

            migrationBuilder.DropColumn(
                name: "IsIncreased",
                table: "StudentAttendances");

            migrationBuilder.CreateTable(
                name: "ProgressCriteriaTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnglishName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VietnameseName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgressCriteriaTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentProgressCriterias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    ProgressCriteriaTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentNeedCareId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentProgressCriterias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentProgressCriterias_ProgressCriteriaTypes_StudentNeedCareId",
                        column: x => x.StudentNeedCareId,
                        principalTable: "ProgressCriteriaTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentProgressCriterias_StudentNeedCares_ProgressCriteriaTypeId",
                        column: x => x.ProgressCriteriaTypeId,
                        principalTable: "StudentNeedCares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentProgressCriterias_ProgressCriteriaTypeId",
                table: "StudentProgressCriterias",
                column: "ProgressCriteriaTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentProgressCriterias_StudentNeedCareId",
                table: "StudentProgressCriterias",
                column: "StudentNeedCareId");
        }
    }
}
