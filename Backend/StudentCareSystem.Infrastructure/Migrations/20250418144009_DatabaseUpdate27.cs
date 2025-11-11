using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate27 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailSubSamples_EmailSamples_EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentSubjects_Subjects_SubjectId",
                table: "StudentSubjects");

            migrationBuilder.DropIndex(
                name: "IX_StudentSubjects_SubjectId",
                table: "StudentSubjects");

            migrationBuilder.DropIndex(
                name: "IX_EmailSubSamples_EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "StudentSubjects");

            migrationBuilder.DropColumn(
                name: "EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.AddColumn<string>(
                name: "EmailState",
                table: "UserEmailLogs",
                type: "nvarchar(10)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmailType",
                table: "UserEmailLogs",
                type: "nvarchar(50)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ErrorMessage",
                table: "UserEmailLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "IdentifierCode",
                table: "UserEmailLogs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "ProxyLogId",
                table: "UserEmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "StudentAttendances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "StudentAttendances",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsSystemEmail",
                table: "EmailSamples",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ProxyLogId",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailState",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "EmailType",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "ErrorMessage",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "IdentifierCode",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "ProxyLogId",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "IsSystemEmail",
                table: "EmailSamples");

            migrationBuilder.DropColumn(
                name: "ProxyLogId",
                table: "EmailLogs");

            migrationBuilder.AddColumn<Guid>(
                name: "SubjectId",
                table: "StudentSubjects",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "StudentAttendances",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                table: "StudentAttendances",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<Guid>(
                name: "EmailSampleId",
                table: "EmailSubSamples",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_SubjectId",
                table: "StudentSubjects",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailSubSamples_EmailSampleId",
                table: "EmailSubSamples",
                column: "EmailSampleId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailSubSamples_EmailSamples_EmailSampleId",
                table: "EmailSubSamples",
                column: "EmailSampleId",
                principalTable: "EmailSamples",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentSubjects_Subjects_SubjectId",
                table: "StudentSubjects",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id");
        }
    }
}
