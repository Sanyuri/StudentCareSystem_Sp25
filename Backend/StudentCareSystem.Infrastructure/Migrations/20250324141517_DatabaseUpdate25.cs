using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate25 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailHistory",
                table: "StudentAttendances");

            migrationBuilder.AddColumn<bool>(
                name: "SkipEmailOnAttendance",
                table: "StudentAttendances",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SkipEmailOnAttendance",
                table: "StudentAttendances");

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailHistory",
                table: "StudentAttendances",
                type: "datetime2",
                nullable: true);
        }
    }
}
