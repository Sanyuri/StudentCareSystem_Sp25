using System;

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentCareSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseUpdate11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentFailedCourses");

            migrationBuilder.DropTable(
                name: "StudentFormsRecords");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "CoefficientName",
                table: "Coefficients",
                type: "nvarchar(50)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "PsychologyNoteTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    EnglishName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VietnameseName = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_PsychologyNoteTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentPoints",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    StudentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SubjectCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    AverageMark = table.Column<double>(type: "float", nullable: false),
                    IsExempt = table.Column<bool>(type: "bit", nullable: false),
                    IsSuspended = table.Column<bool>(type: "bit", nullable: false),
                    ClassName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsAttendanceFail = table.Column<bool>(type: "bit", nullable: false),
                    SemesterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsPassWith = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
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
                    table.PrimaryKey("PK_StudentPoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentPoints_Students_StudentCode",
                        column: x => x.StudentCode,
                        principalTable: "Students",
                        principalColumn: "StudentCode",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentPsychologies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    StudentCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccessPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_StudentPsychologies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentPsychologies_Students_StudentCode",
                        column: x => x.StudentCode,
                        principalTable: "Students",
                        principalColumn: "StudentCode",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentPsychologies_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PsychologyNotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentPsychologyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SemesterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_PsychologyNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PsychologyNotes_StudentPsychologies_StudentPsychologyId",
                        column: x => x.StudentPsychologyId,
                        principalTable: "StudentPsychologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PsychologyNoteDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PsychologyNoteTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PsychologyNoteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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
                    table.PrimaryKey("PK_PsychologyNoteDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PsychologyNoteDetails_PsychologyNoteTypes_PsychologyNoteTypeId",
                        column: x => x.PsychologyNoteTypeId,
                        principalTable: "PsychologyNoteTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PsychologyNoteDetails_PsychologyNotes_PsychologyNoteId",
                        column: x => x.PsychologyNoteId,
                        principalTable: "PsychologyNotes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologyNoteDetails_PsychologyNoteId",
                table: "PsychologyNoteDetails",
                column: "PsychologyNoteId");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologyNoteDetails_PsychologyNoteTypeId",
                table: "PsychologyNoteDetails",
                column: "PsychologyNoteTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologyNotes_StudentPsychologyId",
                table: "PsychologyNotes",
                column: "StudentPsychologyId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPoints_StudentCode",
                table: "StudentPoints",
                column: "StudentCode");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPoints_SubjectCode",
                table: "StudentPoints",
                column: "SubjectCode");

            migrationBuilder.CreateIndex(
                name: "IX_StudentPsychologies_StudentCode",
                table: "StudentPsychologies",
                column: "StudentCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentPsychologies_UserId",
                table: "StudentPsychologies",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PsychologyNoteDetails");

            migrationBuilder.DropTable(
                name: "StudentPoints");

            migrationBuilder.DropTable(
                name: "PsychologyNoteTypes");

            migrationBuilder.DropTable(
                name: "PsychologyNotes");

            migrationBuilder.DropTable(
                name: "StudentPsychologies");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "CoefficientName",
                table: "Coefficients",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)");

            migrationBuilder.CreateTable(
                name: "StudentFailedCourses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    EmailLogId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Class = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailHistory = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailedCoursesDetail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    Major = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Semester = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TotalCourses = table.Column<int>(type: "int", nullable: false),
                    TotalFailedCourses = table.Column<int>(type: "int", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentFailedCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentFailedCourses_EmailLogs_EmailLogId",
                        column: x => x.EmailLogId,
                        principalTable: "EmailLogs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "StudentFormsRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DocumentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmailTemplate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormsRecordCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SignatureDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StudentCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentFormsRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentFailedCourses_EmailLogId",
                table: "StudentFailedCourses",
                column: "EmailLogId");
        }
    }
}
