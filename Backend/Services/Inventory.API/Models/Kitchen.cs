using System.Numerics;

namespace Inventory.API.Models
{
    public class Kitchen
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public IEnumerable<ProductItem> ProductItems { get; set; } = [];
        public IEnumerable<UserKitchen> UserKitchens { get; set; } = [];

        public Kitchen()
        {
            Id = Guid.NewGuid();
            CreatedDate = DateTime.UtcNow;
        }
    }
}