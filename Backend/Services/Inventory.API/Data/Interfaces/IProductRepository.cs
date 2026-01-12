using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<ICollection<Product>> GetProductsByName(string search, int limit);
    }
}