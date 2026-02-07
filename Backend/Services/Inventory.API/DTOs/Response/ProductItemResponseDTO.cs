using Inventory.API.Models;

namespace Inventory.API.DTOs.Response
{
    public class ProductItemResponseDTO
    {
        public Guid Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSize { get; set; } = string.Empty;
        public ICollection<string> Categories { get; set; } = new List<string>();
        public string Brand { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public Unit Unit { get; set; }
        public DateOnly ExpirationDate { get; set; }
    }
}