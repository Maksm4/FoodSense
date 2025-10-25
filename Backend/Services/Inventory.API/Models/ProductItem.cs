using System.Numerics;

namespace Inventory.API.Models
{
    public class ProductItem
    {
        public BigInteger Id { get; set; }
        public int Quantity { get; set; }
        public BigInteger ProductId { get; set; }
        public Product Product { get; set; }
        public double Price { get; set; }
        public DateOnly PurchaseDate { get; set; }
        public DateOnly ExpirationDate { get; set; }
        public Unit Unit { get; set; }
        public BigInteger AddedBy { get; set; }
        public DateTime AddedDate { get; set; }
        public BigInteger KitchenId { get; set; }
        public Kitchen Kitchen { get; set; }
    }
}