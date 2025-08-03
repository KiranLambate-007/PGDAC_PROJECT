using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingBackend.Migrations
{
    /// <inheritdoc />
    public partial class FixedRelationsAndPrecision : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTransferred",
                table: "Tickets",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTransferred",
                table: "Tickets");
        }
    }
}
