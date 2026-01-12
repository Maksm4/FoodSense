using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IProductItemRepository : IGenericRepository<ProductItem>   
    {
        Task<ProductItem?> GetItemFromKitchen(Guid kitchenId, Guid itemId);
        Task<ICollection<ProductItem>> GetAllProductItems(Guid kitchenId);
    }
}