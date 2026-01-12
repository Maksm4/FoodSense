using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IProductItemService
    {
        Task<ProductItemResponseDTO> GetItemFromKitchen(Guid? kitchenId, Guid? itemId);
        Task<IEnumerable<ProductItemResponseDTO>> GetItemsFromKitchen(Guid? kitchenId);
        Task<ProductItemResponseDTO> AddItemToKitchen(Guid? kitchenId, CreateProductItemDto? itemDto);
        Task DeleteItemFromKitchen(Guid? kitchenId, Guid? itemId);
    }
}