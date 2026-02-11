using AutoMapper;
using Common.Exceptions;
using Common.Services;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;

namespace Inventory.API.Services;

public class KitchenInviteService(ICurrentUser currentUser, IKitchenRepository kitchenRepository, IMapper mapper) : IKitchenInviteService
{
    public async Task<InviteLinkResponseDto> GenerateInviteLink(Guid? kitchenId, int expirationHours = 24)
    {
        if (kitchenId == null || kitchenId == Guid.Empty)
        {
            throw new ArgumentNullException(nameof(kitchenId), "Kitchen ID is required");
        }
            
        var userId = currentUser.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
            
        var canGenerate = await kitchenRepository.IsUserOwner(kitchenId.Value, userId);
        if (!canGenerate)
        {
            throw new NotFoundException("kitchen not found or no permission to generate invite link");
        }
        
        //for now based on GUID
        var inviteCode  = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
        var invite = new KitchenInvite
        {
            KitchenId = kitchenId.Value,
            InviteCode = inviteCode,
            ExpiresAt = DateTime.UtcNow.AddHours(expirationHours),
            CreatedByUserId = userId
        };
        await kitchenRepository.AddKitchenInvite(invite);
        return mapper.Map<InviteLinkResponseDto>(invite);
    }
}