using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate07 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NoteType",
                table: "StudentNotes");

            migrationBuilder.RenameColumn(
                name: "CcEmail",
                table: "EmailSamples",
                newName: "CcEmails");

            migrationBuilder.RenameColumn(
                name: "BccEmail",
                table: "EmailSamples",
                newName: "BccEmails");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeletable",
                table: "StudentNotes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "NoteTypeId",
                table: "StudentNotes",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "NoteTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    EnglishNoteTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VietnameseNoteTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_NoteTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentNotes_NoteTypeId",
                table: "StudentNotes",
                column: "NoteTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentNotes_NoteTypes_NoteTypeId",
                table: "StudentNotes",
                column: "NoteTypeId",
                principalTable: "NoteTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentNotes_NoteTypes_NoteTypeId",
                table: "StudentNotes");

            migrationBuilder.DropTable(
                name: "NoteTypes");

            migrationBuilder.DropIndex(
                name: "IX_StudentNotes_NoteTypeId",
                table: "StudentNotes");

            migrationBuilder.DropColumn(
                name: "IsDeletable",
                table: "StudentNotes");

            migrationBuilder.DropColumn(
                name: "NoteTypeId",
                table: "StudentNotes");

            migrationBuilder.RenameColumn(
                name: "CcEmails",
                table: "EmailSamples",
                newName: "CcEmail");

            migrationBuilder.RenameColumn(
                name: "BccEmails",
                table: "EmailSamples",
                newName: "BccEmail");

            migrationBuilder.AddColumn<int>(
                name: "NoteType",
                table: "StudentNotes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
