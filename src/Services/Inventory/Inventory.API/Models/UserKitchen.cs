using System.Numerics;

namespace Inventory.API.Models
{
    public class UserKitchen
    {
        public Guid Id { get; init; } = Guid.NewGuid();
        public UserKitchenRole Role { get; set; } = UserKitchenRole.Member;
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public Guid KitchenId { get; set; }
        public Kitchen Kitchen { get; set; }
    }
}