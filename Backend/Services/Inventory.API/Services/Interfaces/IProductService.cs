using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDTO>> GetAllProducts();
        Task<ProductResponseDTO?> GetProductById(Guid productId);
        Task<ProductResponseDTO> CreateProduct(CreateProductRequestDTO productDto, string userId);
        Task<bool> DeleteProduct(Guid productId);
    }
}