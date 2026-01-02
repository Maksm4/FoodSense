using AutoMapper;
using Inventory.API.Data.Interfaces;
using Inventory.API.Data.Repository;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class KitchenService : IKitchenService
    {
        private readonly IKitchenRepository _kitchenRepository;
        private readonly IMapper _mapper;
        public KitchenService(IKitchenRepository kitchenRepository, IMapper mapper)
        {
            _kitchenRepository = kitchenRepository;
            _mapper = mapper;
        }

        public async Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDTO kitchenDTO, string userId)
        {
            if (kitchenDTO == null)
            {
                throw new ArgumentNullException(nameof(kitchenDTO), "Kitchen data is required");
            }

            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            var kitchenEntity = _mapper.Map<Kitchen>(kitchenDTO);

            kitchenEntity.UserKitchens.Append(new UserKitchen
            {
                UserId = userId,
                Role = UserKitchenRole.Owner,
                Kitchen = kitchenEntity,
                KitchenId = kitchenEntity.Id
            });

            await _kitchenRepository.Add(kitchenEntity);

            await _kitchenRepository.SaveChanges();

            return _mapper.Map<KitchenResponseDTO>(kitchenEntity);
        }

        public async Task<bool> DeleteKitchen(Guid kitchenId)
        {
            var kitchenToDelete = await _kitchenRepository.GetById(kitchenId);

            if (kitchenToDelete == null)
            {
                return false;
            }
            
            _kitchenRepository.Delete(kitchenToDelete);
            await _kitchenRepository.SaveChanges();
            
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
            
            var kitchen = await _kitchenRepository.GetById(kitchenId.Value);
            return  _mapper.Map<KitchenResponseDTO>(kitchen);
        }

        public async Task<IEnumerable<KitchenResponseDTO>> GetKitchens(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId), "User ID is required");
            }

            var kitchens = await _kitchenRepository.GetAll(userId);
            return _mapper.Map<IEnumerable<KitchenResponseDTO>>(kitchens);
        }
    }
}