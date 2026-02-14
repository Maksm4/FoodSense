using System.Numerics;

namespace Inventory.API.Models
{
    public class Product
    {
        public Guid Id { get; init; } =  Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string BarCode { get; set; } = string.Empty;

        public ICollection<Category> Categories { get; set; } = new List<Category>();
        public Category MainCategory { get; set; }
        public Guid? MainCategoryId { get; set; }
        public string VisualRepresentation { get; set; } = string.Empty;
        public ProductScope Scope { get; set; } = ProductScope.Private;
        public string CreatedBy { get; set; } = string.Empty;
        public ICollection<ProductItem> ProductItems { get; set;  } = new List<ProductItem>();
        public Unit DefaultUnit { get; set; }
    }
}