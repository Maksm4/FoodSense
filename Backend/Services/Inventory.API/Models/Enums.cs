namespace Inventory.API.Models
{
    public enum Unit
    {
        pcs,
        ml,
        L,
        g,
        kg
    }
    public enum ProductScope
    {
        Global,
        Private,
        Pending
    }
    
    public enum KitchenSortStrategy
    {
        ExpirationDate,
        Quantity,
        Name,
        AddedDate
    }
}