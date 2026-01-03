using System.Security.Claims;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }
        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "testing-userId";
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProducts([FromQuery] string? search, [FromQuery] int limit = 10)
        {
            var products = await _productService.GetProducts(search, limit);
            return Ok(products);
        }

        [HttpGet("{productId:Guid}")]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProduct([FromRoute] Guid productId)
        {
            var product = await _productService.GetProductById(productId);
            return Ok(product);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProductRequest([FromBody] CreateProductRequestDTO productDto)
        {
            var userId = GetCurrentUserId();
            
            //first created with Scope = private: visible only for this user
            var newProductDTO = await _productService.CreateProduct(productDto, userId);

            return CreatedAtAction(nameof(newProductDTO), new { productId = newProductDTO.Id }, newProductDTO);
        }

        //only for admins
        [HttpDelete("{productId:Guid}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<IActionResult> DeleteProduct([FromRoute] Guid productId)
        {
            await _productService.DeleteProduct(productId);
            return NoContent();
        }
        
        //change scope of product
        //only for admins
        [HttpPatch("{productId:Guid}/scope")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ChangeProductScope([FromRoute] Guid productId, [FromBody] ChangeProductScopeDTO changeProductScopeDto)
        {
            var success = await _productService.ChangeProductScope(productId, changeProductScopeDto.NewScope);

            if (!success)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}