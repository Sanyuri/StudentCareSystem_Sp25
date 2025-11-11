using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentApplications_EmailLogs_EmailLogId",
                table: "StudentApplications");

            migrationBuilder.DropTable(
                name: "Coefficients");

            migrationBuilder.DropIndex(
                name: "IX_StudentApplications_EmailLogId",
                table: "StudentApplications");

            migrationBuilder.DropColumn(
                name: "EmailLogId",
                table: "StudentApplications");

            migrationBuilder.CreateTable(
                name: "UserEmailLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RecipientEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CcEmails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BccEmails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReplyToEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SemesterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_UserEmailLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserEmailLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserEmailLogs_UserId",
                table: "UserEmailLogs",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserEmailLogs");

            migrationBuilder.AddColumn<Guid>(
                name: "EmailLogId",
                table: "StudentApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Coefficients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CoefficientName = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CoefficientValue = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coefficients", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentApplications_EmailLogId",
                table: "StudentApplications",
                column: "EmailLogId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentApplications_EmailLogs_EmailLogId",
                table: "StudentApplications",
                column: "EmailLogId",
                principalTable: "EmailLogs",
                principalColumn: "Id");
        }
    }
}
