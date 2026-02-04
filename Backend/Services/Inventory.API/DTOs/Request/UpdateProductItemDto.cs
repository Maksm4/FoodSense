namespace Inventory.API.DTOs.Request;

public class UpdateProductItemDto
{
    public double? Amount { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public string? Unit { get; set; }
}