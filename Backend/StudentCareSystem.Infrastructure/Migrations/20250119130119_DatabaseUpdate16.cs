using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "EmailSampleId",
                table: "EmailSubSamples",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailSubSampleList",
                table: "EmailSamples",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailSubSamples_EmailSamples_EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.DropIndex(
                name: "IX_EmailSubSamples_EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.DropColumn(
                name: "EmailSampleId",
                table: "EmailSubSamples");

            migrationBuilder.DropColumn(
                name: "EmailSubSampleList",
                table: "EmailSamples");
        }
    }
}
