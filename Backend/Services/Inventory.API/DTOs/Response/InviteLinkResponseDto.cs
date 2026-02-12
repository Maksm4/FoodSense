namespace Inventory.API.DTOs.Response;

public class InviteLinkResponseDto
{
    public string InviteCode { get; set; }
    public string CreatedByUserId { get; set; }
    public DateTime ExpiresAt { get; set; }
}