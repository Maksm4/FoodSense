using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;

namespace Inventory.API.Data.Repository
{
    public class ProductItemRepository : GenericRepository<ProductItem>, IProductItemRepository
    {
        private readonly InventoryDbContext _context;
        public ProductItemRepository(InventoryDbContext context) : base(context)
        {
            _context = context; 
        }


    }
}