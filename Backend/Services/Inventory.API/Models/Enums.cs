namespace Inventory.API.Models
{
    public enum Unit
    {
        pieces,
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