using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace KwizzApi.Migrations
{
    public partial class FixOptions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Value",
                table: "Options",
                newName: "Title");

            migrationBuilder.AddColumn<int>(
                name: "Votes",
                table: "Options",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Votes",
                table: "Options");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Options",
                newName: "Value");
        }
    }
}
