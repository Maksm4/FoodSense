using System.Runtime.InteropServices.ComTypes;
using AutoMapper;
using Common.Exceptions;
using Common.Services;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services
{
    public class ProductService(IProductRepository productRepository, ICurrentUser currentUser, IMapper mapper) : IProductService
    {
        public async Task<IEnumerable<ProductResponseDTO>> GetProducts(string? search, int limit = 10)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return Enumerable.Empty<ProductResponseDTO>();
            }
            
            if (limit > 20) limit = 20;

            var userId = currentUser.UserId; 
            
            var products = await productRepository.GetProductsByName(search, limit, userId);
            return mapper.Map<IEnumerable<ProductResponseDTO>>(products);
        }

        public async Task<ProductResponseDTO?> GetProductById(Guid? productId)
        {
            if (productId == Guid.Empty || productId == null)
            {
                throw new ArgumentException("Product ID cannot be empty or null", nameof(productId));
            }
            var userId = currentUser.UserId;
            
            Product? product =  await productRepository.GetById(productId.Value);
            
            if (product is { Scope: ProductScope.Private } && product.CreatedBy != userId)
            {
                return null;
            }
            
            return product == null ? null : mapper.Map<ProductResponseDTO>(product);
        }

        public async Task<ProductResponseDTO> CreateProduct(CreateProductRequestDto? productDto)
        {
            if (productDto == null)
            {
                throw new ArgumentNullException(nameof(productDto), "Product data is required");
            }
            var userId = currentUser.UserId;
            
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID is required", nameof(userId));
            }
            var productEntity = mapper.Map<Product>(productDto);
            
            await productRepository.Add(productEntity);
            await productRepository.SaveChanges();

            return mapper.Map<ProductResponseDTO>(productEntity);
        }
        
        // TODO: create deleteProduct for global products - admin only
        // only for private products
        public async Task DeleteProduct(Guid? productId)
        {
            if (productId == null || productId == Guid.Empty)
            {
                throw new ArgumentException("Product ID cannot be null or empty", nameof(productId));
            }
            
            var userId = currentUser.UserId;
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentException("User ID is required", nameof(userId));
            }

            if (!await productRepository.IsProductOwnedByUser(productId.Value, userId))
            {
                throw new NotFoundException("Cannot find product or no permission to delete");
            }
            
            Product? product = await productRepository.GetById(productId.Value);
            
            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }
            
            productRepository.Delete(product);
            await productRepository.SaveChanges();
        }
        
        // TODO: to be moved to admin specific controller
        
        // public async Task ChangeProductScope(ChangeProductScopeDto? changeProductScopeDto)
        // {
        //     if (changeProductScopeDto == null)
        //     {
        //         throw new ArgumentNullException(nameof(changeProductScopeDto), "ChangeProductScope data is required");
        //     }
        //     
        //     Product? product = await productRepository.GetById(changeProductScopeDto.ProductId);
        //     if (product == null)
        //     {
        //         throw new NotFoundException("Product not found");
        //     }
        //     
        //     product.Scope = changeProductScopeDto.NewScope; 
        //     await productRepository.SaveChanges();   
        // }
    }
}