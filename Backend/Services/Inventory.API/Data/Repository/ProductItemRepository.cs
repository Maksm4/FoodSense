using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Repository
{
    public class ProductItemRepository(InventoryDbContext context) : GenericRepository<ProductItem>(context), IProductItemRepository
    {
        private readonly InventoryDbContext _context = context;

        public async Task<ProductItem?> GetItemFromKitchen(Guid kitchenId, Guid itemId)
        {
            return await _context.ProductItems
                .Where(pi => pi.KitchenId == kitchenId && pi.Id == itemId)
                .FirstOrDefaultAsync();
        }

        public async Task<ICollection<ProductItem>> GetAllProductItems(Guid kitchenId)
        {
            return await _context.ProductItems
                .Where(p => p.KitchenId == kitchenId).
                ToListAsync();
        }
    }
}