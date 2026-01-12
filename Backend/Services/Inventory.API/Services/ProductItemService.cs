using AutoMapper;
using Common.Exceptions;
using Common.Services;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductItemService(IProductItemRepository productItemRepository, IKitchenRepository kitchenRepository, 
        ICurrentUser currentUser, IMapper mapper) : IProductItemService
    {
        public async Task<ProductItemResponseDTO> GetItemFromKitchen(Guid? kitchenId, Guid? itemId)
        {
            if (itemId == null || itemId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(itemId), "Item ID is required");
            }
            
            var userId = currentUser.UserId;
            await UserHasAccessToKitchen(kitchenId, userId);

            var productItem = await productItemRepository.GetItemFromKitchen(kitchenId!.Value, itemId.Value);

            if (productItem == null)
            {
                throw new NotFoundException("Product item not found in the specified kitchen");
            }
            
            return mapper.Map<ProductItemResponseDTO>(productItem);
        }

        public async Task<IEnumerable<ProductItemResponseDTO>> GetItemsFromKitchen(Guid? kitchenId)
        {
            var userId = currentUser.UserId;
            await UserHasAccessToKitchen(kitchenId, userId);

            var productItems = await productItemRepository.GetAllProductItems(kitchenId.Value);
            return mapper.Map<IEnumerable<ProductItemResponseDTO>>(productItems);
        }

        public async Task<ProductItemResponseDTO> AddItemToKitchen(Guid? kitchenId, CreateProductItemDto? itemDto)
        {
            if (itemDto == null)
            {
                throw new ArgumentNullException(nameof(itemDto), "Item data is required");
            }
            
            var userId = currentUser.UserId;
            await UserHasAccessToKitchen(kitchenId, userId);
            
            var productItemEntity = mapper.Map<ProductItem>(itemDto);
            productItemEntity.KitchenId = kitchenId!.Value;
            
            await productItemRepository.Add(productItemEntity);
            await productItemRepository.SaveChanges();
            
            return mapper.Map<ProductItemResponseDTO>(productItemEntity);
        }

        public async Task DeleteItemFromKitchen(Guid? kitchenId, Guid? itemId)
        {
            if (itemId == null || itemId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(itemId), "Item is required");
            }
            var userId = currentUser.UserId;
            await UserHasAccessToKitchen(kitchenId, userId);
            
            var productItem = await productItemRepository.GetItemFromKitchen(kitchenId!.Value, itemId.Value);
            
            if (productItem == null)
            {
                throw new NotFoundException("Product item not found in the specified kitchen");
            }
            
            productItemRepository.Delete(productItem);
            await productItemRepository.SaveChanges();
        }
        
        private async Task UserHasAccessToKitchen(Guid? kitchenId, string? userId)
        {
            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }
            
            if (!await kitchenRepository.IsUserMember(kitchenId.Value, userId))
            {
                throw new NotFoundException("Kitchen not found or access denied");
            }
        }
    }
}