using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product> GetProductsByName(string search, int limit);
    }
}