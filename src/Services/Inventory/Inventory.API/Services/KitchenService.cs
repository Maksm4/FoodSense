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
    public class KitchenService(IKitchenRepository kitchenRepository, ICurrentUser currentUser, IMapper mapper) : IKitchenService
    {
        public async Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDto? kitchenDto)
        {
            if (kitchenDto == null)
            {
                throw new ArgumentNullException(nameof(kitchenDto), "Kitchen data is required");
            }

            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var kitchenEntity = mapper.Map<Kitchen>(kitchenDto);
            kitchenEntity.UserKitchens.Add(new UserKitchen
            {
                UserId = userId,
                Username = currentUser.UserName ?? "",
                Role = UserKitchenRole.Owner,
                Kitchen = kitchenEntity,
                KitchenId = kitchenEntity.Id,
            });

            await kitchenRepository.Add(kitchenEntity);
            await kitchenRepository.SaveChanges();

            return mapper.Map<KitchenResponseDTO>(kitchenEntity);
        }

        public async Task<bool> DeleteKitchen(Guid? kitchenId)
        {
            if(kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentException("Kitchen ID cannot be null or empty", nameof(kitchenId));
            }
            
            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }
            
            var kitchenToDelete = await kitchenRepository.GetById(kitchenId.Value);
            if (kitchenToDelete == null)
            {
                return false;
            }
            
            var canDelete = await kitchenRepository.IsUserOwner(kitchenId.Value, userId);
            if (!canDelete)
            {
                throw new NotFoundException("kitchen not found or no permission to delete");
            }
            
            kitchenRepository.Delete(kitchenToDelete);
            await kitchenRepository.SaveChanges();

            return true;
        }

        public async Task<KitchenResponseDTO?> GetKitchen(Guid? kitchenId)
        {
            if (kitchenId == null || kitchenId == Guid.Empty)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }
            
            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            
            var kitchen = await kitchenRepository.GetById(kitchenId.Value);
            if (kitchen == null || !await kitchenRepository.IsUserMember(kitchenId.Value, userId))
            {
                throw new NotFoundException("kitchen not found");
            }
            
            return mapper.Map<KitchenResponseDTO>(kitchen);
        }

        public async Task<IEnumerable<KitchenResponseDTO>> GetKitchens()
        {
            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            
            var kitchens = await kitchenRepository.GetAll(userId);
            return mapper.Map<IEnumerable<KitchenResponseDTO>>(kitchens);
        }
    }
}