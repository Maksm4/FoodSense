using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IKitchenService
    {
        Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDTO kitchenDTO, string userId);
        Task<KitchenResponseDTO?> GetKitchen(int kitchenId, string userId);
        Task<IEnumerable<KitchenResponseDTO>> GetUserKitchens(string userId);
        Task<bool> DeleteKitchen(int kitchenId);
    }
}