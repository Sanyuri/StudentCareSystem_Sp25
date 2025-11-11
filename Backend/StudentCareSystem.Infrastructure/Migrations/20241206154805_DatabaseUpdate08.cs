using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate08 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSuccess",
                table: "EmailLogs");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "StudentAttendances",
                newName: "SubjectCode");

            migrationBuilder.RenameColumn(
                name: "CcEmail",
                table: "EmailLogs",
                newName: "CcEmails");

            migrationBuilder.RenameColumn(
                name: "BccEmail",
                table: "EmailLogs",
                newName: "BccEmails");

            migrationBuilder.AddColumn<string>(
                name: "ReplyToEmail",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReplyToEmail",
                table: "EmailLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmailState",
                table: "EmailLogs",
                type: "nvarchar(10)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "IdentifierCode",
                table: "EmailLogs",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentNotes_EntityId",
                table: "StudentNotes",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailLogs_EntityId",
                table: "EmailLogs",
                column: "EntityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentNotes_EntityId",
                table: "StudentNotes");

            migrationBuilder.DropIndex(
                name: "IX_EmailLogs_EntityId",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "ReplyToEmail",
                table: "EmailSamples");

            migrationBuilder.DropColumn(
                name: "BccEmails",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "EmailState",
                table: "EmailLogs");

            migrationBuilder.DropColumn(
                name: "IdentifierCode",
                table: "EmailLogs");

            migrationBuilder.RenameColumn(
                name: "SubjectCode",
                table: "StudentAttendances",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "ReplyToEmail",
                table: "EmailLogs",
                newName: "CcEmail");

            migrationBuilder.RenameColumn(
                name: "CcEmails",
                table: "EmailLogs",
                newName: "BccEmail");

            migrationBuilder.AddColumn<bool>(
                name: "IsSuccess",
                table: "EmailLogs",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
