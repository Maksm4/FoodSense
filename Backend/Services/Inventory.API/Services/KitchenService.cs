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
                UserId = Guid.Parse(userId),
                Role = "Owner",
                Kitchen = kitchenEntity,
                KitchenId = kitchenEntity.Id
            });

            await _kitchenRepository.Add(kitchenEntity);

            await _kitchenRepository.SaveChanges();

            return _mapper.Map<KitchenResponseDTO>(kitchenEntity);
        }

        public Task<bool> DeleteKitchen(int kitchenId)
        {
            throw new NotImplementedException();
        }

        public Task<KitchenResponseDTO?> GetKitchen(int kitchenId, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<KitchenResponseDTO>> GetUserKitchens(string userId)
        {
            throw new NotImplementedException();
        }
    }
}