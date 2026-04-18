using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<ICollection<Product>> GetProductsByName(string search, int limit, string? userId);
        Task<bool> IsProductOwnedByUser(Guid productId, string userId);
        Task<Product?> GetProductById(Guid productId, string? userId);
    }
}