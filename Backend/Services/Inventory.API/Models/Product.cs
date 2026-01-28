using System.Numerics;

namespace Inventory.API.Models
{
    public class Product
    {
        public Guid Id { get; init; } =  Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string BarCode { get; set; } = string.Empty;

        public IEnumerable<Category> Categories { get; set; } = [];
        public string VisualRepresentation { get; set; } = string.Empty;
        public ProductScope Scope { get; set; } = ProductScope.Private;
        public string CreatedBy { get; set; } = string.Empty;
        public IEnumerable<ProductItem> ProductItems { get; set;  } = [];
        public Unit DefaultUnit { get; set; }
    }
}