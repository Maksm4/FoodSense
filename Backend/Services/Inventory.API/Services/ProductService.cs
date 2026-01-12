using System.Runtime.InteropServices.ComTypes;
using AutoMapper;
using Common.Exceptions;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductService(IProductRepository kitchenRepository, IMapper mapper) : IProductService
    {
        public async Task<IEnumerable<ProductResponseDTO>> GetProducts(string? search, int limit = 10)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return Enumerable.Empty<ProductResponseDTO>();
            }
            
            if (limit > 20) limit = 20;

            var products = await kitchenRepository.GetProductsByName(search, limit);
            return mapper.Map<IEnumerable<ProductResponseDTO>>(products);
        }

        public async Task<ProductResponseDTO?> GetProductById(Guid? productId)
        {
            if (productId == Guid.Empty || productId == null)
            {
                throw new ArgumentException("Product ID cannot be empty or null", nameof(productId));
            }
            
            Product? product =  await kitchenRepository.GetById(productId.Value);
            return product == null ? null : mapper.Map<ProductResponseDTO>(product);
        }

        public async Task<ProductResponseDTO> CreateProduct(CreateProductRequestDto? productDto, string? userId)
        {
            if (productDto == null)
            {
                throw new ArgumentNullException(nameof(productDto), "Product data is required");
            }
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID is required", nameof(userId));
            }
            var productEntity = mapper.Map<Product>(productDto);
            
            await kitchenRepository.Add(productEntity);
            await kitchenRepository.SaveChanges();

            return mapper.Map<ProductResponseDTO>(productEntity);
        }

        public async Task DeleteProduct(Guid? productId)
        {
            if (productId == null || productId == Guid.Empty)
            {
                throw new ArgumentException("Product ID cannot be null or empty", nameof(productId));
            }
            
            Product? product = await kitchenRepository.GetById(productId.Value);

            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }
            kitchenRepository.Delete(product);
            await kitchenRepository.SaveChanges();
        }

        public async Task ChangeProductScope(ChangeProductScopeDto? changeProductScopeDto)
        {
            if (changeProductScopeDto == null)
            {
                throw new ArgumentNullException(nameof(changeProductScopeDto), "ChangeProductScope data is required");
            }
            
            Product? product = await kitchenRepository.GetById(changeProductScopeDto.ProductId);
            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }
            
            product.Scope = changeProductScopeDto.NewScope; 
            await kitchenRepository.SaveChanges();   
        }
    }
}