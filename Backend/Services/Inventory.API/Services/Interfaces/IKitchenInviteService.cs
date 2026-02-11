using Inventory.API.DTOs.Response;

namespace Inventory.API.Services.Interfaces;

public interface IKitchenInviteService
{
    Task<InviteLinkResponseDto> GenerateInviteLink(Guid? kitchenId, int expirationHours);
}