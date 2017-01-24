CREATE TABLE "__EFMigrationsHistory" (
    "MigrationId" varchar(150) NOT NULL,
    "ProductVersion" varchar(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);
CREATE TABLE "AspNetRoles" (
    "Id" text NOT NULL,
    "ConcurrencyStamp" text,
    "Name" varchar(256),
    "NormalizedName" varchar(256),
    CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);
CREATE TABLE "AspNetUserTokens" (
    "UserId" text NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name")
);
CREATE TABLE "AspNetRoleClaims" (
    "Id" serial NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    "RoleId" text NOT NULL,
    CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE
);
CREATE TABLE "RoomInfos" (
    "Id" bigserial NOT NULL,
    "Key" text,
    "Name" text NOT NULL,
    "OwnerId" text,
    "Status" int4 NOT NULL,
    CONSTRAINT "PK_RoomInfos" PRIMARY KEY ("Id")
);
CREATE TABLE "Rooms" (
    "Id" bigserial NOT NULL,
    "InfoId" int8,
    CONSTRAINT "PK_Rooms" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Rooms_RoomInfos_InfoId" FOREIGN KEY ("InfoId") REFERENCES "RoomInfos" ("Id") ON DELETE NO ACTION
);
CREATE TABLE "Questions" (
    "Id" bigserial NOT NULL,
    "Description" text,
    "RoomId" int8,
    "Title" text NOT NULL,
    "Type" int4 NOT NULL,
    CONSTRAINT "PK_Questions" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Questions_Rooms_RoomId" FOREIGN KEY ("RoomId") REFERENCES "Rooms" ("Id") ON DELETE NO ACTION
);
CREATE TABLE "Options" (
    "Id" bigserial NOT NULL,
    "QuestionId" int8,
    "Value" text NOT NULL,
    CONSTRAINT "PK_Options" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Options_Questions_QuestionId" FOREIGN KEY ("QuestionId") REFERENCES "Questions" ("Id") ON DELETE NO ACTION
);
CREATE TABLE "AspNetUsers" (
    "Id" text NOT NULL,
    "AccessFailedCount" int4 NOT NULL,
    "ConcurrencyStamp" text,
    "Email" varchar(256),
    "EmailConfirmed" bool NOT NULL,
    "LockoutEnabled" bool NOT NULL,
    "LockoutEnd" timestamptz,
    "NormalizedEmail" varchar(256),
    "NormalizedUserName" varchar(256),
    "OptionId" int8,
    "PasswordHash" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" bool NOT NULL,
    "SecurityStamp" text,
    "TwoFactorEnabled" bool NOT NULL,
    "UserName" varchar(256),
    CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetUsers_Options_OptionId" FOREIGN KEY ("OptionId") REFERENCES "Options" ("Id") ON DELETE NO ACTION
);
CREATE TABLE "AspNetUserClaims" (
    "Id" serial NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);
CREATE TABLE "AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey"),
    CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);
CREATE TABLE "AspNetUserRoles" (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL,
    CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId"),
    CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "AspNetRoles" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);
CREATE INDEX "EmailIndex" ON "AspNetUsers" ("NormalizedEmail");
CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" ("NormalizedUserName");
CREATE INDEX "IX_AspNetUsers_OptionId" ON "AspNetUsers" ("OptionId");
CREATE INDEX "IX_Options_QuestionId" ON "Options" ("QuestionId");
CREATE INDEX "IX_Questions_RoomId" ON "Questions" ("RoomId");
CREATE INDEX "IX_Rooms_InfoId" ON "Rooms" ("InfoId");
CREATE INDEX "IX_RoomInfos_OwnerId" ON "RoomInfos" ("OwnerId");
CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" ("NormalizedName");
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" ("RoleId");
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" ("UserId");
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" ("UserId");
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" ("RoleId");
ALTER TABLE "RoomInfos" ADD CONSTRAINT "FK_RoomInfos_AspNetUsers_OwnerId" FOREIGN KEY ("OwnerId") REFERENCES "AspNetUsers" ("Id") ON DELETE NO ACTION;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20170123113556_InitialMigration', '1.1.0-rtm-22752');
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20170123123510_AddQuestionsLink', '1.1.0-rtm-22752');
ALTER TABLE "Options" RENAME COLUMN "Value" TO "Title";
ALTER TABLE "Options" ADD "Votes" int4 NOT NULL DEFAULT 0;
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20170124084517_FixOptions', '1.1.0-rtm-22752');
ALTER TABLE "AspNetUsers" DROP CONSTRAINT "FK_AspNetUsers_Options_OptionId";
DROP INDEX "IX_AspNetUsers_OptionId";
ALTER TABLE "AspNetUsers" DROP COLUMN "OptionId";
CREATE TABLE "UserAnswer" (
    "OptionId" int8 NOT NULL,
    "UserId" text NOT NULL,
    CONSTRAINT "PK_UserAnswer" PRIMARY KEY ("OptionId", "UserId"),
    CONSTRAINT "FK_UserAnswer_Options_OptionId" FOREIGN KEY ("OptionId") REFERENCES "Options" ("Id") ON DELETE CASCADE,
    CONSTRAINT "FK_UserAnswer_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers" ("Id") ON DELETE CASCADE
);
CREATE INDEX "IX_UserAnswer_UserId" ON "UserAnswer" ("UserId");
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20170124155641_AddAnswers', '1.1.0-rtm-22752');
