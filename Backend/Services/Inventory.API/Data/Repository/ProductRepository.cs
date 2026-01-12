using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Repository
{
    public class ProductRepository(InventoryDbContext context) : GenericRepository<Product>(context), IProductRepository
    {
        private readonly InventoryDbContext _context = context;

        public async Task<ICollection<Product>> GetProductsByName(string search, int limit, string? userId)
        {
            return await _context.Products
                .Where(p => p.Name.Contains(search) && (p.Scope == ProductScope.Global || (userId != null && p.CreatedBy == userId)))
                .Take(limit)
                .ToListAsync();
        }

        public async Task<bool> IsProductOwnedByUser(Guid productId, string userId)
        {
            return await _context.Products
                .AnyAsync(p => p.Id == productId && p.CreatedBy == userId);
        }
    }
}