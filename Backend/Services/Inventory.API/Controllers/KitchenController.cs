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
    public class KitchenController : ControllerBase
    {
        private readonly IKitchenService _kitchenService;

        public KitchenController(IKitchenService kitchenService)
        {
            _kitchenService = kitchenService;
        }

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
            var kitchenDto = await _kitchenService.GetKitchen(kitchenId, userId);
            if (kitchenDto == null)
            {
                return NotFound();
            }

            return Ok(kitchenDto);
        }

        
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<KitchenResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetKitchens()
        {
            var userId = GetCurrentUserId();
            var kitchensDto = await _kitchenService.GetKitchens(userId);

            return Ok(kitchensDto);
        }

        [HttpPost]
        [ProducesResponseType(typeof(KitchenResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateKitchen([FromBody] CreateKitchenDTO? createKitchenDto)
        {
            if(createKitchenDto == null)
            {
                return BadRequest("Kitchen data is required");
            }

            var userId = GetCurrentUserId();
            var createdKitchenDto = await _kitchenService.CreateKitchen(createKitchenDto, userId);

            return CreatedAtAction(nameof(GetKitchen), new { kitchenId = createdKitchenDto.Id }, createdKitchenDto);
        }

        [HttpDelete("{kitchenId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteKitchen([FromRoute] Guid kitchenId)
        {
            var deleted = await _kitchenService.DeleteKitchen(kitchenId);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
    
    // add option for inviting other users to kitchen
}