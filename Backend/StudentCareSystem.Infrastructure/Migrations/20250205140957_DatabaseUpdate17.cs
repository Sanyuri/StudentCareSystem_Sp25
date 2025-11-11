using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate17 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProgressCriteriaTypes",
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
                    table.PrimaryKey("PK_ProgressCriteriaTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentNeedCares",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    StudentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SemesterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rank = table.Column<int>(type: "int", nullable: false),
                    SupportStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    ProgressStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    FollowUpCareStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CareStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    FinalComment = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_StudentNeedCares", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentNeedCares_Students_StudentCode",
                        column: x => x.StudentCode,
                        principalTable: "Students",
                        principalColumn: "StudentCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentCareAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    StudentNeedCareId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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
                    table.PrimaryKey("PK_StudentCareAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentCareAssignments_StudentNeedCares_StudentNeedCareId",
                        column: x => x.StudentNeedCareId,
                        principalTable: "StudentNeedCares",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentCareAssignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentProgressCriterias",
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
                name: "IX_StudentCareAssignments_StudentNeedCareId",
                table: "StudentCareAssignments",
                column: "StudentNeedCareId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCareAssignments_UserId",
                table: "StudentCareAssignments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentNeedCares_StudentCode",
                table: "StudentNeedCares",
                column: "StudentCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentProgressCriterias_ProgressCriteriaTypeId",
                table: "StudentProgressCriterias",
                column: "ProgressCriteriaTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentProgressCriterias_StudentNeedCareId",
                table: "StudentProgressCriterias",
                column: "StudentNeedCareId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentCareAssignments");

            migrationBuilder.DropTable(
                name: "StudentProgressCriterias");

            migrationBuilder.DropTable(
                name: "ProgressCriteriaTypes");

            migrationBuilder.DropTable(
                name: "StudentNeedCares");
        }
    }
}
