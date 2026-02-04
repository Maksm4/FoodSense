using System.Numerics;

namespace Inventory.API.Models
{
    public class ProductItem
    {
        public Guid Id { get; init; } =  Guid.NewGuid();
        public int Quantity { get; set; }
        public double ProductSize { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
        public double Price { get; set; }
        public DateOnly PurchaseDate { get; set; }
        public DateOnly ExpirationDate { get; set; }
        public Unit Unit { get; set; }
        public string AddedBy { get; set; } = string.Empty;
        public DateTime AddedDate { get; set; }
        public Guid KitchenId { get; set; }
        public Kitchen Kitchen { get; set; }
    }
}