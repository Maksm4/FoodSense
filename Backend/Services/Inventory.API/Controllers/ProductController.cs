using System.Security.Claims;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/inventory/products")]
    [ApiController]
    [Authorize]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts([FromQuery] string? search, [FromQuery] int limit = 10)
        {
            var products = await productService.GetProducts(search, limit);
            return Ok(products);
        }

        [HttpGet("{productId:Guid}")]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProduct([FromRoute] Guid productId)
        {
            var product = await productService.GetProductById(productId);
            return Ok(product);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProductRequest([FromBody] CreateProductRequestDto productDto)
        {
            var newProductDto = await productService.CreateProduct(productDto);

            return CreatedAtAction(nameof(GetProduct), new { productId = newProductDto.Id }, newProductDto);
        }

        //only for admins
        [HttpDelete("{productId:Guid}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<IActionResult> DeleteProduct([FromRoute] Guid productId)
        {
            await productService.DeleteProduct(productId);
            return NoContent();
        }
        
        //change scope of product
        //TODO: only for admins
        
        // [HttpPatch("{productId:Guid}/scope")]
        // [Authorize(Roles = "Admin")]
        // [ProducesResponseType(StatusCodes.Status204NoContent)]
        // [ProducesResponseType(StatusCodes.Status403Forbidden)]
        // [ProducesResponseType(StatusCodes.Status404NotFound)]
        // public async Task<IActionResult> ChangeProductScope([FromRoute] Guid productId, [FromBody] ChangeProductScopeDto changeProductScopeDto)
        // {
        //     await productService.ChangeProductScope(changeProductScopeDto);
        //     return NoContent();
        // }
    }
}