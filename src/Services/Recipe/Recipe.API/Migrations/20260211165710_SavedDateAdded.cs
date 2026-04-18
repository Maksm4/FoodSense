using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Recipe.API.Migrations
{
    /// <inheritdoc />
    public partial class SavedDateAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "SavedAt",
                table: "UserRecipe",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SavedAt",
                table: "UserRecipe");
        }
    }
}
