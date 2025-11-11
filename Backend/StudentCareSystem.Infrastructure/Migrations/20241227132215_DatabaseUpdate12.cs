using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Channel",
                table: "StudentNotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProcessingTime",
                table: "StudentNotes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Channel",
                table: "StudentNotes");

            migrationBuilder.DropColumn(
                name: "ProcessingTime",
                table: "StudentNotes");
        }
    }
}
