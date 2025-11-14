using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;

namespace Inventory.API.Data.Repository
{
    public class KitchenRepository : GenericRepository<Kitchen>, IKitchenRepository
    {
        private readonly InventoryDbContext _context;

        public KitchenRepository(InventoryDbContext context) : base(context)
        {
            _context = context;
        }

        public Task<IEnumerable<ProductItem>> GetAllProductItems(Guid kitchenId)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Kitchen>> GetAll(string userId)
        {
            throw new NotImplementedException();
        }
    }
}