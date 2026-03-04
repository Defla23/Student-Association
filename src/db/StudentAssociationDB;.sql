CREATE DATABASE StudentAssociationDB;
GO

USE StudentAssociationDB;
GO

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    phone_number NVARCHAR(10) UNIQUE,
    verification_code CHAR(6),
    role NVARCHAR(10) NOT NULL DEFAULT 'student',
    is_verified BIT DEFAULT 0,
    is_profile_complete BIT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO Users (first_name,last_name,email,password,phone_number,verification_code,role,is_verified,is_profile_complete)
VALUES 
('Mark', 'Tunner', 'admin@example.com', 'pass123', '0711111111', '000000', 'admin', 1, 1),
('John', 'King', 'john@example.com', 'pass123', '0722222222', '123456', 'admin', 1, 1),
('Jane', 'Smith', 'jane@example.com', 'pass123', '0733333333', '654321', 'student', 0, 0),
('Mike', 'Brown', 'mike@example.com', 'pass123', '0744444444', '987654', 'student', 0, 0);
GO
select * from users

SELECT email, password FROM Users WHERE id = 10;

DROP TABLE IF EXISTS Education;
CREATE TABLE Education (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    school_name NVARCHAR(255) NOT NULL,
    registration_number NVARCHAR(20) NOT NULL UNIQUE,
    course NVARCHAR(255) NOT NULL,
    year_of_study INT NOT NULL,
    academic_status NVARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Education_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

INSERT INTO Education (user_id, school_name, registration_number, course, year_of_study, academic_status)
VALUES 
(2,'Kenya University','KU12345','Computer Science',2,'Ongoing'),
(3,'Kenya University','KU12346','Software Engineering',3,'Attachment'),
(4,'Kenya University','KU12347','Information Technology',2,'Deferred');
GO

select * from Education

DROP TABLE IF EXISTS BursaryApplications;

CREATE TABLE BursaryApplications (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    reason NVARCHAR(MAX) NOT NULL,
    supporting_document NVARCHAR(255),
    status NVARCHAR(20) DEFAULT 'Pending',
    admin_comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Bursary_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

INSERT INTO BursaryApplications (user_id, reason,  supporting_document)
VALUES
(2,'Tuition Fee Support','docs/tuition_john.pdf'),
(3,'Accommodation Support','docs/accommodation_jane.pdf');
GO

select * from BursaryApplications

DROP TABLE IF EXISTS Articles;

CREATE TABLE Articles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    is_approved BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Articles_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO

INSERT INTO Articles (user_id, title, content)
VALUES
(2,'My Campus Experience','It has been amazing so far!'),
(3,'Tips for Online Learning','Here are some tips to stay productive.');
GO
select * from Articles

DROP TABLE IF EXISTS Concerns;

CREATE TABLE Concerns (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) DEFAULT 'Open',
    admin_response NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Concerns_User FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);
GO


INSERT INTO Concerns (user_id, title, description)
VALUES
(2,'Hostel Issue','Water supply not consistent.'),
(3,'Exam Timetable','Need clarification on exam dates.');
GO


select * from Concerns