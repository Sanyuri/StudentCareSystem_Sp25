-- Insert roles
INSERT INTO Roles (Id, RoleType, VietnameseName, EnglishName, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy, IsDeleted, DeletedAt, DeletedBy)
VALUES
-- Admin
(N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', N'Admin',   N'Quản trị viên',  N'Administrator',
 '2024-09-05 17:43:17.0000000', NULL, NULL, NULL, 0, NULL, NULL),

-- Officer
(N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDB', N'Officer', N'Nhân viên',      N'Officer',
 '2024-09-05 17:43:17.0000000', NULL, NULL, NULL, 0, NULL, NULL),

-- Manager
(N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDC', N'Manager', N'Quản lý',        N'Manager',
 '2024-09-05 17:43:17.0000000', NULL, NULL, NULL, 0, NULL, NULL);



INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', N'viht7@fpt.edu.vn', N'Huỳnh Triệu Vĩ', N'viht7@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDB', N'hongbvhe171254@fpt.edu.vn', N'Bùi Việt Hồng', N'hongbvhe171254@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDC', N'sonbthe172207@fpt.edu.vn', N'Bùi Tuấn Sơn', N'sonbthe172207@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDD', N'quangnvhe172037@fpt.edu.vn', N'Nguyễn Vinh Quang', N'quangnvhe172037@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDE', N'minhvche161378@fpt.edu.vn', N'Vương Công Minh', N'minhvche161378@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

INSERT INTO Users (Id, UserName, FullName, Email, Password, PhoneNumber, DOB, RoleId, Status, Notes, IsDeleted, DeletedAt, DeletedBy, CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
VALUES (N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDF', N'tungpthe171795@fpt.edu.vn', N'Phạm Thanh Tùng', N'tungpthe171795@fpt.edu.vn', N'AQAAAAIAAYagAAAAEKbh776i/oWigAbuJ0GA4sxZO0+96PwrYlnzQdXdBmN47YiCKjfURjTHtadGB2ACPw==', N'123456789', N'1', N'D14FB3B6-2E02-4F8F-8D21-65A6B7C6DBDA', 1, null, 0, null, null, N'2024-09-05 17:43:17.0000000', null, null, null);

