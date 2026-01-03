using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;

namespace Inventory.API.Data.Repository
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        private readonly InventoryDbContext _context;
        public ProductRepository(InventoryDbContext context) : base(context)
        {
            _context = context;
        }
        
        public Task<Product> GetProductsByName(string search, int limit)
        {
            throw new NotImplementedException();
        }
    }
}