using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IKitchenService
    {
        Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDTO kitchenDTO, string userId);
        Task<KitchenResponseDTO?> GetKitchen(Guid? kitchenId, string userId);
        Task<IEnumerable<KitchenResponseDTO>> GetKitchens(string userId);
        Task<bool> DeleteKitchen(Guid kitchenId);
    }
}