using System.Numerics;

namespace Inventory.API.Models
{
    public class Category
    {
        public Guid Id { get; init; }  = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public IEnumerable<Product> Products { get; set; } = [];
    }
}