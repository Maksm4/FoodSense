using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IKitchenRepository : IGenericRepository<Kitchen>
    {
        Task<IEnumerable<ProductItem>> GetAllProductItems(Guid kitchenId);
        Task<IEnumerable<Kitchen>> GetAll(string userId);
    }
}