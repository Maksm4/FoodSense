using Inventory.API.Data.Interfaces;
using Inventory.API.Models;

namespace Inventory.API.Data.Repository
{
    public class KitchenRepository : IKitchenRepository
    {
        public Task Add(Kitchen entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(Kitchen entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Kitchen>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<Kitchen?> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Task SaveChanges()
        {
            throw new NotImplementedException();
        }

        public void Update(Kitchen entity)
        {
            throw new NotImplementedException();
        }
    }
}
