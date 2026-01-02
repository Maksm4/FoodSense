using AutoMapper;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        
        public ProductService(IProductRepository kitchenRepository, IMapper mapper)
        {
            _productRepository = kitchenRepository;
            _mapper = mapper;
        }
        
        public async Task<IEnumerable<ProductResponseDTO>> GetProducts(string? search, int limit = 10)
        {
            if (string.IsNullOrEmpty(search))
            {
                search = "";
            }
            
            var matchingProducts = await _productRepository.GetProductsByName(search, limit);
            
            if (matchingProducts == null || !matchingProducts.Any())
            {
                return _mapper.Map<IEnumerable<ProductResponseDTO>>(Enumerable.Empty<ProductResponseDTO>());
            }

            return _mapper.Map<IEnumerable<ProductResponseDTO>>(matchingProducts);
        }

        public Task<ProductResponseDTO?> GetProductById(Guid productId)
        {
            throw new NotImplementedException();
        }

        public Task<ProductResponseDTO> CreateProduct(CreateProductRequestDTO productDto, string userId)
        {
            throw new NotImplementedException();
        }

        public Task<bool> DeleteProduct(Guid productId)
        {
            throw new NotImplementedException();
        }
    }
}