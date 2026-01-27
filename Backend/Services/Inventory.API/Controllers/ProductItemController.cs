using System.Security.Claims;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/inventory/kitchens/{kitchenId:guid}/items")]
    [ApiController]
    [Authorize]
    public class ProductItemController(IProductItemService productItemService) : ControllerBase
    {
        [HttpGet("{itemId:guid}")]
        [ProducesResponseType(typeof(ProductItemResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetProductItemById([FromRoute] Guid kitchenId, [FromRoute] Guid itemId)
        {
            var itemDto = await productItemService.GetItemFromKitchen(kitchenId, itemId);
            return Ok(itemDto);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ProductItemResponseDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetProductItems([FromRoute] Guid kitchenId, [FromQuery] KitchenSortStrategy sort = KitchenSortStrategy.ExpirationDate,
            [FromQuery] bool asc = true)
        {
            var items = await productItemService.GetItemsFromKitchen(kitchenId, sort, asc);
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
            await productItemService.DeleteItemFromKitchen(kitchenId, itemId);
            return NoContent();
        }
    }
}