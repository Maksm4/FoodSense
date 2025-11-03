using System.Numerics;

namespace Inventory.API.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public IEnumerable<Product> Products { get; set; } = [];    
    }
}