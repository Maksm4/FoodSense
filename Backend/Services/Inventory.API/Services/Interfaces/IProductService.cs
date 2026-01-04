using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponseDTO>> GetProducts(string? search, int limit = 10);
        Task<ProductResponseDTO?> GetProductById(Guid productId);
        Task<ProductResponseDTO> CreateProduct(CreateProductRequestDto? productDto, string userId);
        Task DeleteProduct(Guid productId);
        
        Task ChangeProductScope(ChangeProductScopeDto changeProductScopeDto);
    }
}