using System.Numerics;

namespace Inventory.API.Models
{
    public class UserKitchen
    {
        public Guid Id { get; } = Guid.NewGuid();
        public string Role { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public Guid KitchenId { get; set; }
        public Kitchen Kitchen { get; set; }
    }
}