using System.Numerics;

namespace Inventory.API.Models
{
    public class Kitchen
    {
        public Guid Id { get; init; } =  Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public ICollection<ProductItem> ProductItems { get; set; } = new List<ProductItem>();
        public ICollection<UserKitchen> UserKitchens { get; set; } = new List<UserKitchen>();
        public ICollection<KitchenInvite> KitchenInvites { get; set; } = new List<KitchenInvite>();
        
        public Kitchen()
        {
            CreatedDate = DateTime.UtcNow;
        }
    }
}