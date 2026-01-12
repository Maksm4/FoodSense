using System.Security.Claims;
using Inventory.API.DTOs.Request;
using Inventory.API.DTOs.Response;
using Inventory.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Inventory.API.Controllers
{
    [Route("api/kitchens")]
    [ApiController]
    [Authorize]
    public class KitchenController(IKitchenService kitchenService) : ControllerBase
    {
        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "testing-userId";
        }

        [HttpGet("{kitchenId:guid}")]
        [ProducesResponseType(typeof(KitchenResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetKitchen([FromRoute] Guid kitchenId)
        {
            var userId = GetCurrentUserId();
            var kitchenDto = await kitchenService.GetKitchen(kitchenId);
            return Ok(kitchenDto);
        }
        
        //get all kitchens for CURRENT user
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<KitchenResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetKitchens()
        {
            var userId = GetCurrentUserId();
            var kitchensDto = await kitchenService.GetKitchens();

            return Ok(kitchensDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(KitchenResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateKitchen([FromBody] CreateKitchenDto? createKitchenDto)
        {
            var userId = GetCurrentUserId();
            var createdKitchenDto = await kitchenService.CreateKitchen(createKitchenDto);

            return CreatedAtAction(nameof(GetKitchen), new { kitchenId = createdKitchenDto.Id }, createdKitchenDto);
        }

        //only the owner can delete the kitchen
        [HttpDelete("{kitchenId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteKitchen([FromRoute] Guid kitchenId)
        {
            await kitchenService.DeleteKitchen(kitchenId);
            return NoContent();
        }
    }
    
    // add option for inviting other users to kitchen
}