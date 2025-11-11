using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate23 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressCriteria_ProgressCriterionTypes_ProgressCriteriaTypeId",
                table: "ProgressCriteria");

            migrationBuilder.RenameColumn(
                name: "ProgressCriteriaTypeId",
                table: "ProgressCriteria",
                newName: "ProgressCriterionTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_ProgressCriteria_ProgressCriteriaTypeId",
                table: "ProgressCriteria",
                newName: "IX_ProgressCriteria_ProgressCriterionTypeId");

            migrationBuilder.AddColumn<double>(
                name: "Point",
                table: "StudentNeedCares",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "EnglishDescription",
                table: "ProgressCriterionTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VietnameseDescription",
                table: "ProgressCriterionTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<double>(
                name: "Score",
                table: "ProgressCriteria",
                type: "float",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressCriteria_ProgressCriterionTypes_ProgressCriterionTypeId",
                table: "ProgressCriteria",
                column: "ProgressCriterionTypeId",
                principalTable: "ProgressCriterionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgressCriteria_ProgressCriterionTypes_ProgressCriterionTypeId",
                table: "ProgressCriteria");

            migrationBuilder.DropColumn(
                name: "Point",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "EnglishDescription",
                table: "ProgressCriterionTypes");

            migrationBuilder.DropColumn(
                name: "VietnameseDescription",
                table: "ProgressCriterionTypes");

            migrationBuilder.RenameColumn(
                name: "ProgressCriterionTypeId",
                table: "ProgressCriteria",
                newName: "ProgressCriteriaTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_ProgressCriteria_ProgressCriterionTypeId",
                table: "ProgressCriteria",
                newName: "IX_ProgressCriteria_ProgressCriteriaTypeId");

            migrationBuilder.AlterColumn<int>(
                name: "Score",
                table: "ProgressCriteria",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgressCriteria_ProgressCriterionTypes_ProgressCriteriaTypeId",
                table: "ProgressCriteria",
                column: "ProgressCriteriaTypeId",
                principalTable: "ProgressCriterionTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
