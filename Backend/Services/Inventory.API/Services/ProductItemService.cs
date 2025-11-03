using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductItemService : IProductService
    {
        public Task<ProductResponseDTO> CreateProduct(CreateProductRequestDTO productDto, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteProduct(Guid productId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ProductResponseDTO>> GetAllProducts()
        {
            throw new NotImplementedException();
        }

        public Task<ProductResponseDTO?> GetProductById(Guid productId)
        {
            throw new NotImplementedException();
        }
    }
}