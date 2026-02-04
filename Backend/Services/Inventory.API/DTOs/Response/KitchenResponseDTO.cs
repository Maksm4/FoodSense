using Inventory.API.Models;

namespace Inventory.API.DTOs.Response
{
    public class KitchenResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public IEnumerable<ProductItemResponseDTO> ProductItems { get; set; } = [];
        public IEnumerable<Guid> Users { get; set; } = [];
    }
}