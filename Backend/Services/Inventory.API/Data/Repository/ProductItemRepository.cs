using System.IO.Pipes;
using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Repository
{
    public class ProductItemRepository(InventoryDbContext context)
        : GenericRepository<ProductItem>(context), IProductItemRepository
    {
        private readonly InventoryDbContext _context = context;

        public async Task<ProductItem?> GetItemFromKitchen(Guid kitchenId, Guid itemId)
        {
            return await _context.ProductItems
                .Include(pi => pi.Product)
                .Where(pi => pi.KitchenId == kitchenId && pi.Id == itemId)
                .FirstOrDefaultAsync();
        }

        public async Task<ICollection<ProductItem>> GetAllProductItems(Guid kitchenId, KitchenSortStrategy sortStrategy,
            bool ascending)
        {
            return await _context.ProductItems
                .Include(pi => pi.Product)
                .Where(p => p.KitchenId == kitchenId)
                .ApplySorting(sortStrategy, ascending)
                .ToListAsync();
        }
    }

    public static class ProductItemExtensions
    {
        public static IQueryable<ProductItem> ApplySorting(this IQueryable<ProductItem> query, KitchenSortStrategy sortStrategy, bool ascending = true)
        {
            return (sortStrategy, ascending) switch
            {
                (KitchenSortStrategy.Name, true) => query.OrderBy(pi => pi.Product.Name),
                (KitchenSortStrategy.Name, false) => query.OrderByDescending(pi => pi.Product.Name),
                (KitchenSortStrategy.ExpirationDate, true) => query.OrderBy(pi => pi.ExpirationDate),
                (KitchenSortStrategy.ExpirationDate, false) => query.OrderByDescending(pi => pi.ExpirationDate),
                (KitchenSortStrategy.Quantity, true) => query.OrderBy(pi => pi.Quantity),
                (KitchenSortStrategy.Quantity, false) => query.OrderByDescending(pi => pi.Quantity),
                _ => query
            };
        }
    }
}