using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate01 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Applications_ApplicationTypes_ApplicationTypeId",
                table: "Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Applications_EmailLogs_EmailLogId",
                table: "Applications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Applications",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Class",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "CurrentLeaveHistory",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "EmailHistory",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "LeaveDuration",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "Major",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "ParentPhoneNumber",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "PreviousLeaveHistory",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "Semester",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "StudentName",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.DropColumn(
                name: "DateReceived",
                table: "Applications");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Applications");

            migrationBuilder.RenameTable(
                name: "Applications",
                newName: "StudentApplications");

            migrationBuilder.RenameIndex(
                name: "IX_Applications_EmailLogId",
                table: "StudentApplications",
                newName: "IX_StudentApplications_EmailLogId");

            migrationBuilder.RenameIndex(
                name: "IX_Applications_ApplicationTypeId",
                table: "StudentApplications",
                newName: "IX_StudentApplications_ApplicationTypeId");

            migrationBuilder.AlterColumn<string>(
                name: "StatusCode",
                table: "Students",
                type: "nvarchar(5)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "StudentApplications",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentApplications",
                table: "StudentApplications",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AttendanceHistories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    OldTotalAbsences = table.Column<int>(type: "int", nullable: false),
                    NewTotalAbsences = table.Column<int>(type: "int", nullable: false),
                    OldAbsenceRate = table.Column<double>(type: "float", nullable: false),
                    NewAbsenceRate = table.Column<double>(type: "float", nullable: false),
                    StudentAttendanceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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
                    table.PrimaryKey("PK_AttendanceHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendanceHistories_StudentAttendances_StudentAttendanceId",
                        column: x => x.StudentAttendanceId,
                        principalTable: "StudentAttendances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentApplications_CreatedAt",
                table: "StudentApplications",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_StudentApplications_StudentCode",
                table: "StudentApplications",
                column: "StudentCode");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceHistories_StudentAttendanceId",
                table: "AttendanceHistories",
                column: "StudentAttendanceId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentApplications_ApplicationTypes_ApplicationTypeId",
                table: "StudentApplications",
                column: "ApplicationTypeId",
                principalTable: "ApplicationTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentApplications_EmailLogs_EmailLogId",
                table: "StudentApplications",
                column: "EmailLogId",
                principalTable: "EmailLogs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentApplications_Students_StudentCode",
                table: "StudentApplications",
                column: "StudentCode",
                principalTable: "Students",
                principalColumn: "StudentCode",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentApplications_ApplicationTypes_ApplicationTypeId",
                table: "StudentApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentApplications_EmailLogs_EmailLogId",
                table: "StudentApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentApplications_Students_StudentCode",
                table: "StudentApplications");

            migrationBuilder.DropTable(
                name: "AttendanceHistories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentApplications",
                table: "StudentApplications");

            migrationBuilder.DropIndex(
                name: "IX_StudentApplications_CreatedAt",
                table: "StudentApplications");

            migrationBuilder.DropIndex(
                name: "IX_StudentApplications_StudentCode",
                table: "StudentApplications");

            migrationBuilder.RenameTable(
                name: "StudentApplications",
                newName: "Applications");

            migrationBuilder.RenameIndex(
                name: "IX_StudentApplications_EmailLogId",
                table: "Applications",
                newName: "IX_Applications_EmailLogId");

            migrationBuilder.RenameIndex(
                name: "IX_StudentApplications_ApplicationTypeId",
                table: "Applications",
                newName: "IX_Applications_ApplicationTypeId");

            migrationBuilder.AlterColumn<int>(
                name: "StatusCode",
                table: "Students",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)");

            migrationBuilder.AddColumn<string>(
                name: "Class",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentLeaveHistory",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailHistory",
                table: "StudentLeaveOfAbsences",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LeaveDuration",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Major",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ParentPhoneNumber",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PreviousLeaveHistory",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Semester",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentName",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateReceived",
                table: "Applications",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Applications",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Applications",
                table: "Applications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_ApplicationTypes_ApplicationTypeId",
                table: "Applications",
                column: "ApplicationTypeId",
                principalTable: "ApplicationTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Applications_EmailLogs_EmailLogId",
                table: "Applications",
                column: "EmailLogId",
                principalTable: "EmailLogs",
                principalColumn: "Id");
        }
    }
}
