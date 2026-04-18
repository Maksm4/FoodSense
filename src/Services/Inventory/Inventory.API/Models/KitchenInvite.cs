namespace Inventory.API.Models;

public class KitchenInvite
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string InviteCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public string CreatedByUserId { get; set; } = string.Empty;
    public Guid KitchenId { get; set; }
    public Kitchen Kitchen { get; set; }
}