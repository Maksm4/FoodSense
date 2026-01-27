namespace Inventory.API.Models
{
    public enum Unit
    {
        ml,
        L,
        lb,
        Oz,
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