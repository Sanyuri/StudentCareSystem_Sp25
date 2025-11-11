using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate04 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentCourses");

            migrationBuilder.RenameColumn(
                name: "UpdateInfo",
                table: "StudentAttendances",
                newName: "SemesterName");

            migrationBuilder.CreateTable(
                name: "StudentSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    SubjectCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OldSubjectCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubjectGroup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VietnameseCourseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnglishCourseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TakeAttendance = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_StudentSubjects", x => x.Id);
                    table.UniqueConstraint("AK_StudentSubjects_SubjectCode", x => x.SubjectCode);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_SubjectCode",
                table: "StudentSubjects",
                column: "SubjectCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentSubjects");

            migrationBuilder.RenameColumn(
                name: "SemesterName",
                table: "StudentAttendances",
                newName: "UpdateInfo");

            migrationBuilder.CreateTable(
                name: "StudentCourses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    CourseCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CourseType = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnglishCourseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAttendanceExempted = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VietnameseCourseName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentCourses", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_CourseCode",
                table: "StudentCourses",
                column: "CourseCode",
                unique: true);
        }
    }
}
