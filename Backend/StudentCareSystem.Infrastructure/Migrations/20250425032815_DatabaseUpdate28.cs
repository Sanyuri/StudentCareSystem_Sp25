using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate28 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserEmailLogs_Users_UserId",
                table: "UserEmailLogs");

            migrationBuilder.DropIndex(
                name: "IX_UserEmailLogs_UserId",
                table: "UserEmailLogs");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserEmailLogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "UserEmailLogs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_UserEmailLogs_UserId",
                table: "UserEmailLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserEmailLogs_Users_UserId",
                table: "UserEmailLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
