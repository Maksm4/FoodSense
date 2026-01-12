using System.Security.Claims;
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
    public class ProductItemController(IProductItemService productItemService) : ControllerBase
    {
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

            var itemDto = await productItemService.GetItemFromKitchen(kitchenId, itemId, userId);
            return Ok(itemDto);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductItemResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetProductItems([FromRoute] Guid kitchenId)
        {
            var userId = GetCurrentUserId();

            var items = await productItemService.GetItemsFromKitchen(kitchenId, userId);
            return Ok(items);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ProductItemResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateProductItem(Guid kitchenId, [FromBody] CreateProductItemDto itemDto)
        {
            var createdItem = await productItemService.AddItemToKitchen(kitchenId, itemDto);
            return CreatedAtAction(nameof(GetProductItemById), new { kitchenId }, createdItem);
        }

        [HttpDelete("{itemId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteProductItem([FromRoute] Guid kitchenId, [FromRoute] Guid itemId)
        {
            var userId = GetCurrentUserId();
            
            await productItemService.DeleteItemFromKitchen(kitchenId, itemId, userId);
            return NoContent();
        }
    }
}