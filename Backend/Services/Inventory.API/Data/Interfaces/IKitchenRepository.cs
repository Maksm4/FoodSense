using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IKitchenRepository
    {
        Task<IEnumerable<ProductItem>> GetAllProductItems(int kitchenId);
    }
}