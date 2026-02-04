using System.Numerics;

namespace Inventory.API.Models
{
    public class Category
    {
        public Guid Id { get; init; }  = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}