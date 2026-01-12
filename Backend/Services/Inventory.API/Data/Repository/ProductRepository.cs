using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Repository
{
    public class ProductRepository(InventoryDbContext context) : GenericRepository<Product>(context), IProductRepository
    {
        private readonly InventoryDbContext _context = context;

        public async Task<ICollection<Product>> GetProductsByName(string search, int limit)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(search))
                .Take(limit)
                .ToListAsync();
        }
    }
}