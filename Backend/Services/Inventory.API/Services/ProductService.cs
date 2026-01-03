using AutoMapper;
using Common.Exceptions;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
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
            if (string.IsNullOrWhiteSpace(search))
            {
                return Enumerable.Empty<ProductResponseDTO>();
            }
            
            if (limit > 20) limit = 20;

            var products = await _productRepository.GetProductsByName(search, limit);
            return _mapper.Map<IEnumerable<ProductResponseDTO>>(products);
        }

        public async Task<ProductResponseDTO?> GetProductById(Guid productId)
        {
            if (productId == Guid.Empty)
            {
                throw new ArgumentException("Product ID cannot be empty", nameof(productId));
            }
            
            Product? product =  await _productRepository.GetById(productId);
            return product == null ? null : _mapper.Map<ProductResponseDTO>(product);
        }

        public async Task<ProductResponseDTO> CreateProduct(CreateProductRequestDTO? productDto, string userId)
        {
            var productEntity = _mapper.Map<Product>(productDto);
            
            await _productRepository.Add(productEntity);
            await _productRepository.SaveChanges();

            return _mapper.Map<ProductResponseDTO>(productEntity);
        }

        public async Task DeleteProduct(Guid productId)
        {
            Product? product = await _productRepository.GetById(productId);

            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }
            _productRepository.Delete(product);
            await _productRepository.SaveChanges();
        }
    }
}