using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate05 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentAttendances_EmailLogs_EmailLogId",
                table: "StudentAttendances");

            migrationBuilder.DropIndex(
                name: "IX_StudentAttendances_EmailLogId",
                table: "StudentAttendances");

            migrationBuilder.DropColumn(
                name: "EmailLogId",
                table: "StudentAttendances");

            migrationBuilder.DropColumn(
                name: "SentAt",
                table: "EmailLogs");

            migrationBuilder.RenameColumn(
                name: "Body",
                table: "EmailLogs",
                newName: "Content");

            migrationBuilder.AlterColumn<string>(
                name: "SubjectGroup",
                table: "StudentSubjects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "BccEmail",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CcEmail",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BccEmail",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CcEmail",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "EntityId",
                table: "EmailLogs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentCode",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AbsenceRateBoundaries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    MinAbsenceRate = table.Column<double>(type: "float", nullable: false),
                    MaxAbsenceRate = table.Column<double>(type: "float", nullable: false),
                    EmailSampleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AbsenceRateBoundaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AbsenceRateBoundaries_EmailSamples_EmailSampleId",
                        column: x => x.EmailSampleId,
                        principalTable: "EmailSamples",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AbsenceRateBoundaries_EmailSampleId",
                table: "AbsenceRateBoundaries",
                column: "EmailSampleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AbsenceRateBoundaries");

            migrationBuilder.DropColumn(
                name: "BccEmail",
                table: "EmailSamples");

            migrationBuilder.DropColumn(
                name: "CcEmail",
                table: "EmailSamples");

            migrationBuilder.DropColumn(
                name: "BccEmail",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "CcEmail",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "EntityId",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "StudentCode",
                table: "EmailLogs");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "EmailLogs",
                newName: "Body");

            migrationBuilder.AlterColumn<string>(
                name: "SubjectGroup",
                table: "StudentSubjects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "EmailLogId",
                table: "StudentAttendances",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SentAt",
                table: "EmailLogs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_StudentAttendances_EmailLogId",
                table: "StudentAttendances",
                column: "EmailLogId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentAttendances_EmailLogs_EmailLogId",
                table: "StudentAttendances",
                column: "EmailLogId",
                principalTable: "EmailLogs",
                principalColumn: "Id");
        }
    }
}
