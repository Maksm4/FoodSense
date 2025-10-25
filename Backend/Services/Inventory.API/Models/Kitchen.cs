using System.Numerics;

namespace Inventory.API.Models
{
    public class Kitchen
    {
        public BigInteger Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public IEnumerable<ProductItem> ProductItems { get; set; } = [];
        public IEnumerable<UserKitchen> UserKitchens { get; set; } = [];
    }
}