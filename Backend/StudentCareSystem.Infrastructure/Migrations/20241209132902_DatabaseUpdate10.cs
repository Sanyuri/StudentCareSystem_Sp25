using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCurrentSemester",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "VietnameseEmailContent",
                table: "EmailSamples");

            migrationBuilder.DropColumn(
                name: "VietnameseEmailSubject",
                table: "EmailSamples");

            migrationBuilder.RenameColumn(
                name: "VietnameseCourseName",
                table: "StudentSubjects",
                newName: "VietnameseName");

            migrationBuilder.RenameColumn(
                name: "EnglishCourseName",
                table: "StudentSubjects",
                newName: "EnglishName");

            migrationBuilder.RenameColumn(
                name: "VietnameseNoteTypeName",
                table: "NoteTypes",
                newName: "VietnameseName");

            migrationBuilder.RenameColumn(
                name: "EnglishNoteTypeName",
                table: "NoteTypes",
                newName: "EnglishName");

            migrationBuilder.RenameColumn(
                name: "VietnameseMajorName",
                table: "Majors",
                newName: "VietnameseName");

            migrationBuilder.RenameColumn(
                name: "EnglishMajorName",
                table: "Majors",
                newName: "EnglishName");

            migrationBuilder.RenameColumn(
                name: "EnglishEmailSubject",
                table: "EmailSamples",
                newName: "Subject");

            migrationBuilder.RenameColumn(
                name: "EnglishEmailContent",
                table: "EmailSamples",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "VietnameseApplicationName",
                table: "ApplicationTypes",
                newName: "VietnameseName");

            migrationBuilder.RenameColumn(
                name: "EnglishApplicationName",
                table: "ApplicationTypes",
                newName: "EnglishName");

            migrationBuilder.AddColumn<string>(
                name: "DefaultNoteType",
                table: "NoteTypes",
                type: "nvarchar(50)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultNoteType",
                table: "NoteTypes");

            migrationBuilder.RenameColumn(
                name: "VietnameseName",
                table: "StudentSubjects",
                newName: "VietnameseCourseName");

            migrationBuilder.RenameColumn(
                name: "EnglishName",
                table: "StudentSubjects",
                newName: "EnglishCourseName");

            migrationBuilder.RenameColumn(
                name: "VietnameseName",
                table: "NoteTypes",
                newName: "VietnameseNoteTypeName");

            migrationBuilder.RenameColumn(
                name: "EnglishName",
                table: "NoteTypes",
                newName: "EnglishNoteTypeName");

            migrationBuilder.RenameColumn(
                name: "VietnameseName",
                table: "Majors",
                newName: "VietnameseMajorName");

            migrationBuilder.RenameColumn(
                name: "EnglishName",
                table: "Majors",
                newName: "EnglishMajorName");

            migrationBuilder.RenameColumn(
                name: "Subject",
                table: "EmailSamples",
                newName: "EnglishEmailSubject");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "EmailSamples",
                newName: "EnglishEmailContent");

            migrationBuilder.RenameColumn(
                name: "VietnameseName",
                table: "ApplicationTypes",
                newName: "VietnameseApplicationName");

            migrationBuilder.RenameColumn(
                name: "EnglishName",
                table: "ApplicationTypes",
                newName: "EnglishApplicationName");

            migrationBuilder.AddColumn<bool>(
                name: "IsCurrentSemester",
                table: "Students",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "VietnameseEmailContent",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VietnameseEmailSubject",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
