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
        public async Task<IActionResult> GetProducts()
        {
            var products = await _productService.GetAllProducts();
            return Ok(products);
        }

        [HttpGet("{productId:Guid}")]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetProduct([FromRoute] Guid productId)
        {
            var products = await _productService.GetAllProducts();
            return Ok(products);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProductResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDTO productDto)
        {
            var userId = GetCurrentUserId();

            var newProductDTO = await _productService.CreateProduct(productDto, userId);

            return CreatedAtAction(nameof(newProductDTO), new { productId = newProductDTO.Id }, newProductDTO);
        }

        [HttpDelete("{productId:Guid}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]

        public async Task<IActionResult> DeleteProduct([FromRoute] Guid productId)
        {
            var success = await _productService.DeleteProduct(productId);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}