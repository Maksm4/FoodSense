using System.Numerics;

namespace Inventory.API.Models
{
    public class UserKitchen
    {
        public BigInteger Id { get; set; }
        public BigInteger UserId { get; set; }
        public BigInteger KitchenId { get; set; }
        public Kitchen Kitchen { get; set; }
    }
}