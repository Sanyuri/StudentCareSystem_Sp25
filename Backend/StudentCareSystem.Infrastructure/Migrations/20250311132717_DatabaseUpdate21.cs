using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate21 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentSubjects");

            migrationBuilder.DropColumn(
                name: "FollowUpCareStatus",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "ProgressStatus",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "SupportStatus",
                table: "StudentNeedCares");

            migrationBuilder.AddColumn<bool>(
                name: "IsCollaborating",
                table: "StudentNeedCares",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsProgressing",
                table: "StudentNeedCares",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "NeedsCareNextTerm",
                table: "StudentNeedCares",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    SubjectCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OldSubjectCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubjectGroup = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VietnameseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnglishName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TakeAttendance = table.Column<bool>(type: "bit", nullable: false),
                    TotalSlots = table.Column<int>(type: "int", nullable: false),
                    ReplacedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsGraded = table.Column<bool>(type: "bit", nullable: false),
                    IsBeforeOjt = table.Column<bool>(type: "bit", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                    table.UniqueConstraint("AK_Subjects_SubjectCode", x => x.SubjectCode);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_SubjectCode",
                table: "Subjects",
                column: "SubjectCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropColumn(
                name: "IsCollaborating",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "IsProgressing",
                table: "StudentNeedCares");

            migrationBuilder.DropColumn(
                name: "NeedsCareNextTerm",
                table: "StudentNeedCares");

            migrationBuilder.AddColumn<string>(
                name: "FollowUpCareStatus",
                table: "StudentNeedCares",
                type: "nvarchar(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProgressStatus",
                table: "StudentNeedCares",
                type: "nvarchar(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SupportStatus",
                table: "StudentNeedCares",
                type: "nvarchar(20)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "StudentSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnglishName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsBeforeOjt = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsGraded = table.Column<bool>(type: "bit", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    OldSubjectCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ReplacedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SubjectCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SubjectGroup = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TakeAttendance = table.Column<bool>(type: "bit", nullable: false),
                    TotalSlots = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VietnameseName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSubjects", x => x.Id);
                    table.UniqueConstraint("AK_StudentSubjects_SubjectCode", x => x.SubjectCode);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_SubjectCode",
                table: "StudentSubjects",
                column: "SubjectCode",
                unique: true);
        }
    }
}
