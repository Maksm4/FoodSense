using AutoMapper;
using Common.Exceptions;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductItemService(IProductItemRepository productItemRepository, IMapper mapper) : IProductItemService
    {
        public async Task<ProductItemResponseDTO> GetItemFromKitchen(Guid? kitchenId, Guid? itemId, string? userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }
            
            if (itemId == null || itemId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(itemId), "Item ID is required");
            }
            //TODO: I need to check if the user is in this kitchen (in all methods)

            var productItem = await productItemRepository.GetItemFromKitchen(kitchenId.Value, itemId.Value);

            if (productItem == null)
            {
                throw new NotFoundException("Product item not found in the specified kitchen");
            }
            
            return mapper.Map<ProductItemResponseDTO>(productItem);
        }

        public async Task<IEnumerable<ProductItemResponseDTO>> GetItemsFromKitchen(Guid? kitchenId, string? userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }
            
            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }
            
            var productItems = await productItemRepository.GetAllProductItems(kitchenId.Value);
            return mapper.Map<IEnumerable<ProductItemResponseDTO>>(productItems);
            
        }

        public async Task<ProductItemResponseDTO> AddItemToKitchen(Guid? kitchenId, CreateProductItemDto? itemDto)
        {
            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }

            if (itemDto == null)
            {
                throw new ArgumentNullException(nameof(itemDto), "Item data is required");
            }
            
            var productItemEntity = mapper.Map<ProductItem>(itemDto);
            await productItemRepository.AddItem(productItemEntity, kitchenId.Value);
            await productItemRepository.SaveChanges();
            
            return mapper.Map<ProductItemResponseDTO>(productItemEntity);
            
        }

        public async Task DeleteItemFromKitchen(Guid? kitchenId, Guid? itemId, string? userId)
        {
            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }

            if (itemId == null || itemId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(itemId), "Item is required");
            }
            
            var productItem = await productItemRepository.GetItemFromKitchen(kitchenId.Value, itemId.Value);
            
            if (productItem == null)
            {
                throw new NotFoundException("Product item not found in the specified kitchen");
            }
            
            productItemRepository.DeleteItem(productItem);
            await productItemRepository.SaveChanges();
        }
    }
}