using Inventory.API.Models;

namespace Inventory.API.DTOs.Request;

public class ChangeProductScopeDto
{
    public Guid ProductId { get; set; }
    public ProductScope NewScope { get; set; } = ProductScope.Pending;
}