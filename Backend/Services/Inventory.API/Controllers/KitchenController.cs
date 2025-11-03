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

        [HttpGet("{kitchenId:int}")]
        [ProducesResponseType(typeof(KitchenResponseDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetKitchenById([FromRoute] int kitchenId)
        {
            if (kitchenId < 0)
            {
                return BadRequest("Invalid kitchen ID.");
            }

            var userId = GetCurrentUserId();
            var kitchenDTO = await _kitchenService.GetKitchen(kitchenId, userId);
            if (kitchenDTO == null)
            {
                return NotFound();
            }

            return Ok(kitchenDTO);
        }

        
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<KitchenResponseDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetKitchens()
        {
            var userId = GetCurrentUserId();
            var kitchensDTO = await _kitchenService.GetUserKitchens(userId);

            return Ok(kitchensDTO);
        }

        [HttpPost]
        [ProducesResponseType(typeof(KitchenResponseDTO), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateKitchen([FromBody] CreateKitchenDTO createKitchenDto)
        {
            if(createKitchenDto == null)
            {
                return BadRequest("Kitchen data is required");
            }

            var userId = GetCurrentUserId();
            var createdKitchenDTO = await _kitchenService.CreateKitchen(createKitchenDto, userId);

            return CreatedAtAction(nameof(GetKitchenById), new { kitchenId = createdKitchenDTO.Id }, createdKitchenDTO);
        }

        [HttpDelete("{kitchenId:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteKitchen([FromRoute] int kitchenId)
        {
            var deleted = await _kitchenService.DeleteKitchen(kitchenId);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}