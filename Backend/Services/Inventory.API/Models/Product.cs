using System.Numerics;

namespace Inventory.API.Models
{
    public class Product
    {
        public Guid Id { get; } =  Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string BarCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        //public string VisualRepresentation base64 ?
        public ProductScope Scope { get; set; } = ProductScope.Private;
        public IEnumerable<ProductItem> ProductItems { get; set;  } = [];
        public Unit DefaultUnit { get; set; }
    }
}