using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IKitchenService
    {
        Task<KitchenResponseDTO> CreateKitchen(CreateKitchenDto? kitchenDto);
        Task<KitchenResponseDTO?> GetKitchen(Guid? kitchenId);
        Task<IEnumerable<KitchenResponseDTO>> GetKitchens();
        Task<bool> DeleteKitchen(Guid? kitchenId);
    }
}