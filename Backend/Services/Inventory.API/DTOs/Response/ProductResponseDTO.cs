using Inventory.API.Models;

namespace Inventory.API.DTOs.Response
{
    public class ProductResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string BarCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public Unit DefaultUnit { get; set; }
    }
}