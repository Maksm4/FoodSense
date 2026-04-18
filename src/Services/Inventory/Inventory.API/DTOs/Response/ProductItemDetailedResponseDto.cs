using Inventory.API.Models;

namespace Inventory.API.DTOs.Response;

public class ProductItemDetailedResponseDto
{
    
    public Guid Id { get; set; }
    public int Quantity { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public double Price { get; set; }
    public DateOnly PurchaseDate { get; set; }
    public DateOnly ExpirationDate { get; set; }
    public Unit Unit { get; set; }
    public string AddedBy { get; set; } = string.Empty; //username
    public DateTime AddedDate { get; set; }
    public Guid KitchenId { get; set; }
    public string KitchenName { get; set; } = string.Empty;
}