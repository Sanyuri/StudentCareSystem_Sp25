using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate06 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "EmailLogs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SemesterName",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsSendEmail",
                table: "AttendanceHistories",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "StudentNotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    NoteType = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SemesterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EntityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_StudentNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentNotes_Students_StudentCode",
                        column: x => x.StudentCode,
                        principalTable: "Students",
                        principalColumn: "StudentCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_StudentCode",
                table: "EmailLogs",
                column: "StudentCode");

            migrationBuilder.CreateIndex(
                name: "IX_StudentNotes_StudentCode",
                table: "StudentNotes",
                column: "StudentCode");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs",
                column: "StudentCode",
                principalTable: "Students",
                principalColumn: "StudentCode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs");

            migrationBuilder.DropTable(
                name: "StudentNotes");

            migrationBuilder.DropIndex(
                name: "IX_EmailLogs_StudentCode",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "SemesterName",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "IsSendEmail",
                table: "AttendanceHistories");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
