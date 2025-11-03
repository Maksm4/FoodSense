using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IKitchenRepository : IGenericRepository<Kitchen>
    {
        Task<IEnumerable<ProductItem>> GetAllProductItems(int kitchenId);
    }
}