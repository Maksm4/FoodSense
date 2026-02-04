using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;

namespace Inventory.API.Services.Interfaces
{
    public interface IProductItemService
    {
        Task<ProductItemResponseDTO> GetItemFromKitchen(Guid? kitchenId, Guid? itemId);
        Task<IEnumerable<ProductItemResponseDTO>> GetItemsFromKitchen(Guid? kitchenId, KitchenSortStrategy sortStrategy, bool ascending);
        Task<ProductItemResponseDTO> AddItemToKitchen(Guid? kitchenId, CreateProductItemDto? itemDto);
        Task DeleteItemFromKitchen(Guid? kitchenId, Guid? itemId);
        Task<ProductItemResponseDTO> UpdateItemInKitchen(Guid? kitchenId, Guid? itemId, UpdateProductItemDto updateDto);
    }
}