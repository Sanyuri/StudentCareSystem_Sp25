using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate18 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs");

            migrationBuilder.DropIndex(
                name: "IX_StudentNeedCares_StudentCode",
                table: "StudentNeedCares");

            migrationBuilder.AddColumn<int>(
                name: "TotalSlots",
                table: "StudentSubjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAttendanceExempt",
                table: "Students",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "EmailLogs",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentNeedCares_StudentCode",
                table: "StudentNeedCares",
                column: "StudentCode");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs",
                column: "StudentCode",
                principalTable: "Students",
                principalColumn: "StudentCode",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs");

            migrationBuilder.DropIndex(
                name: "IX_StudentNeedCares_StudentCode",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "TotalSlots",
                table: "StudentSubjects");

            migrationBuilder.DropColumn(
                name: "IsAttendanceExempt",
                table: "Students");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "EmailLogs",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_StudentNeedCares_StudentCode",
                table: "StudentNeedCares",
                column: "StudentCode",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EmailLogs_Students_StudentCode",
                table: "EmailLogs",
                column: "StudentCode",
                principalTable: "Students",
                principalColumn: "StudentCode");
        }
    }
}
