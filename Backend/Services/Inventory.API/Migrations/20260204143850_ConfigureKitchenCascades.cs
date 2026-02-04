using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Inventory.API.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureKitchenCascades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductItem_Kitchen_KitchenId",
                table: "ProductItem");

            migrationBuilder.DropForeignKey(
                name: "FK_UserKitchen_Kitchen_KitchenId",
                table: "UserKitchen");

            migrationBuilder.AddColumn<string>(
                name: "UserName",
                table: "UserKitchen",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductItem_Kitchen_KitchenId",
                table: "ProductItem",
                column: "KitchenId",
                principalTable: "Kitchen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserKitchen_Kitchen_KitchenId",
                table: "UserKitchen",
                column: "KitchenId",
                principalTable: "Kitchen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductItem_Kitchen_KitchenId",
                table: "ProductItem");

            migrationBuilder.DropForeignKey(
                name: "FK_UserKitchen_Kitchen_KitchenId",
                table: "UserKitchen");

            migrationBuilder.DropColumn(
                name: "UserName",
                table: "UserKitchen");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductItem_Kitchen_KitchenId",
                table: "ProductItem",
                column: "KitchenId",
                principalTable: "Kitchen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_UserKitchen_Kitchen_KitchenId",
                table: "UserKitchen",
                column: "KitchenId",
                principalTable: "Kitchen",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
