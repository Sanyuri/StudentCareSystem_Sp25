using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentLeaveOfAbsences",
                table: "StudentLeaveOfAbsences");

            migrationBuilder.RenameTable(
                name: "StudentLeaveOfAbsences",
                newName: "StudentDefers");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "StudentDefers",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DefermentDate",
                table: "StudentDefers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "DeferredSemesterName",
                table: "StudentDefers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "StudentDefers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "StudentDefers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "StudentDefers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "StudentDefers",
                type: "nvarchar(50)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "StudentDeferType",
                table: "StudentDefers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentDefers",
                table: "StudentDefers",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_StudentDefers_StudentCode",
                table: "StudentDefers",
                column: "StudentCode");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentDefers_Students_StudentCode",
                table: "StudentDefers",
                column: "StudentCode",
                principalTable: "Students",
                principalColumn: "StudentCode",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentDefers_Students_StudentCode",
                table: "StudentDefers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StudentDefers",
                table: "StudentDefers");

            migrationBuilder.DropIndex(
                name: "IX_StudentDefers_StudentCode",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "DefermentDate",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "DeferredSemesterName",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "StudentDefers");

            migrationBuilder.DropColumn(
                name: "StudentDeferType",
                table: "StudentDefers");

            migrationBuilder.RenameTable(
                name: "StudentDefers",
                newName: "StudentLeaveOfAbsences");

            migrationBuilder.AlterColumn<string>(
                name: "StudentCode",
                table: "StudentLeaveOfAbsences",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentLeaveOfAbsences",
                table: "StudentLeaveOfAbsences",
                column: "Id");
        }
    }
}
