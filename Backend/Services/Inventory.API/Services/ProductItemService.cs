using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductItemService : IProductService
    {
        public Task<ProductResponseDTO> CreateProduct(CreateProductRequestDto? productDto, string userId)
        {
            throw new NotImplementedException();
        }

        public Task DeleteProduct(Guid productId)
        {
            throw new NotImplementedException();
        }

        public Task ChangeProductScope(ChangeProductScopeDto changeProductScopeDto)
        {
            throw new NotImplementedException();
        }

        public Task ChangeProductScope(Guid productId, ChangeProductScopeDto changeProductScopeDto)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ProductResponseDTO>> GetProducts(string? search, int limit = 10)
        {
            throw new NotImplementedException();
        }

        public Task<ProductResponseDTO?> GetProductById(Guid productId)
        {
            throw new NotImplementedException();
        }
    }
}