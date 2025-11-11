using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate32 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAttendanceFail",
                table: "StudentPoints");

            migrationBuilder.DropColumn(
                name: "IsSuspended",
                table: "StudentPoints");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "StudentPoints",
                newName: "IsSendMail");

            migrationBuilder.AddColumn<string>(
                name: "FailReason",
                table: "StudentPoints",
                type: "nvarchar(30)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PointStatus",
                table: "StudentPoints",
                type: "nvarchar(30)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FailReason",
                table: "StudentPoints");

            migrationBuilder.DropColumn(
                name: "PointStatus",
                table: "StudentPoints");

            migrationBuilder.RenameColumn(
                name: "IsSendMail",
                table: "StudentPoints",
                newName: "Status");

            migrationBuilder.AddColumn<bool>(
                name: "IsAttendanceFail",
                table: "StudentPoints",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsSuspended",
                table: "StudentPoints",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
