namespace Inventory.API.DTOs.Response;

public class InviteLinkResponseDto
{
    public string InviteLink { get; set; }
    public string InviteCode { get; set; }
    public DateTime ExpiresAt { get; set; }
}