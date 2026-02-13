using AutoMapper;
using Common.Exceptions;
using Common.Services;
using Inventory.API.Data.Interfaces;
using Inventory.API.DTOs.Response;
using Inventory.API.Models;
using Inventory.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

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
        const int maxRetries = 3;
        var retries = 0;

        while (true)
        {
            var inviteCode = GenerateInviteCode();

            var invite = new KitchenInvite
            {
                KitchenId = kitchenId.Value,
                InviteCode = inviteCode,
                ExpiresAt = DateTime.UtcNow.AddHours(expirationHours),
                CreatedByUserId = userId
            };
            try
            {
                await kitchenRepository.AddKitchenInvite(invite);
                return mapper.Map<InviteLinkResponseDto>(invite);
            }
            catch (DbUpdateException)
            {
                retries++;
                if (retries > maxRetries) throw new Exception("System is busy, please try again.");
            }
        }
    }

    public async Task JoinKitchenByLink(string inviteCode)
    {
        var userId = currentUser.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        
        var invite = await kitchenRepository.GetKitchenInvite(inviteCode);
        if (invite == null || invite.ExpiresAt < DateTime.UtcNow)
        {
            throw new NotFoundException("Invalid or expired invite code");
        }

        var userKitchen = new UserKitchen
        {
            KitchenId = invite.KitchenId,
            UserId = userId,
            Username = currentUser.UserName ?? "",
            Role = UserKitchenRole.Member
        };
        
        await kitchenRepository.AddUserKitchen(userKitchen);
    }
    
    private string GenerateInviteCode()
    {
        return Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
    }
}