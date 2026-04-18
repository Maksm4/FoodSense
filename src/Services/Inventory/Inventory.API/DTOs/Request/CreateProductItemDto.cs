using Inventory.API.Models;

namespace Inventory.API.DTOs.Request
{
    public class CreateProductItemDto
    {
        public int Quantity { get; set; }
        public Guid ProductId { get; set; }
        public double Price { get; set; }
        public double ProductSize { get; set; }
        public DateOnly PurchaseDate { get; set; }
        public DateOnly ExpirationDate { get; set; }
        public Unit Unit { get; set; }
    }
}