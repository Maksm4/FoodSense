using AutoMapper;
using Common.Exceptions;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class KitchenService(IKitchenRepository kitchenRepository, IMapper mapper) : IKitchenService
    {
        public async Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDto? kitchenDto, string userId)
        {
            if (kitchenDto == null)
            {
                throw new ArgumentNullException(nameof(kitchenDto), "Kitchen data is required");
            }

            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID is required", nameof(userId));
            }

            var kitchenEntity = mapper.Map<Kitchen>(kitchenDto);
            kitchenEntity.UserKitchens.Add(new UserKitchen
            {
                UserId = userId,
                Role = UserKitchenRole.Owner,
                Kitchen = kitchenEntity,
                KitchenId = kitchenEntity.Id
            });

            await kitchenRepository.Add(kitchenEntity);
            await kitchenRepository.SaveChanges();

            return mapper.Map<KitchenResponseDTO>(kitchenEntity);
        }

        public async Task<bool> DeleteKitchen(Guid kitchenId)
        {
            var kitchenToDelete = await kitchenRepository.GetById(kitchenId);

            if (kitchenToDelete == null)
            {
                return false;
            }

            kitchenRepository.Delete(kitchenToDelete);
            await kitchenRepository.SaveChanges();

            return true;
        }

        public async Task<KitchenResponseDTO?> GetKitchen(Guid? kitchenId, string? userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            if (kitchenId == null)
            {
                throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
            }

            var kitchen = await kitchenRepository.GetById(kitchenId.Value);
            if (kitchen == null)
            {
                throw new NotFoundException("kitchen not found");
            }
            
            return mapper.Map<KitchenResponseDTO>(kitchen);
        }

        public async Task<IEnumerable<KitchenResponseDTO>> GetKitchens(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            var kitchens = await kitchenRepository.GetAll(userId);
            return mapper.Map<IEnumerable<KitchenResponseDTO>>(kitchens);
        }
    }
}