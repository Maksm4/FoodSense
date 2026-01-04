using AutoMapper;
using Inventory.API.Data.Interfaces;
using Inventory.API.Data.Repository;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class KitchenService(IKitchenRepository kitchenRepository, IMapper mapper) : IKitchenService
    {
        public async Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDto kitchenDTO, string userId)
        {
            if (kitchenDTO == null)
            {
                throw new ArgumentNullException(nameof(kitchenDTO), "Kitchen data is required");
            }

            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            var kitchenEntity = mapper.Map<Kitchen>(kitchenDTO);

            kitchenEntity.UserKitchens.Append(new UserKitchen
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
            return  mapper.Map<KitchenResponseDTO>(kitchen);
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