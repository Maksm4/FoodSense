using System.Security.Claims;
using AutoMapper;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/kitchens/{kitchenId:guid}/items")]
    [ApiController]
    [Authorize]
    public class ProductItemController : ControllerBase
    {
        private readonly IProductItemService _productItemService;
        public ProductItemController(IProductItemService productItemService)
        {
            _productItemService = productItemService;
        }
        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "testing-userId";
        }

        [HttpGet("{itemId:guid}")]
        [ProducesResponseType(typeof(ProductItemResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetProductItemById([FromRoute] Guid kitchenId, [FromRoute] Guid itemId)
        {
            var userId = GetCurrentUserId();

            var itemDTO = await _productItemService.GetItemFromKitchen(kitchenId, itemId, userId);
            if (itemDTO == null)
            {
                return NotFound();
            }

            return Ok(itemDTO);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductItemResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetProductItems([FromRoute] Guid kitchenId)
        {
            var userId = GetCurrentUserId();

            var items = await _productItemService.GetItemsFromKitchen(kitchenId, userId);
            return Ok(items);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProductItemResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateProductItem(Guid kitchenId, [FromBody] CreateProductItemDTO itemDTO)
        {
            var createdItem = await _productItemService.AddItemToKitchen(kitchenId, itemDTO);
            return CreatedAtAction(nameof(GetProductItems), new { kitchenId = kitchenId }, createdItem);
        }

        [HttpDelete("{itemId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteProductItem([FromRoute] Guid kitchenId, [FromRoute] Guid itemId)
        {
            var userId = GetCurrentUserId();

            await _productItemService.DeleteItemFromKitchen(kitchenId, itemId, userId);

            return NoContent();
        }
    }
}