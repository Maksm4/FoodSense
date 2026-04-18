using Inventory.API.Models;

namespace Inventory.API.Data.Interfaces
{
    public interface IKitchenRepository : IGenericRepository<Kitchen>
    {
        Task<IEnumerable<Kitchen>> GetAll(string userId);
        public Task<bool> IsUserMember(Guid kitchenId, string userId);
        Task<bool> IsUserOwner(Guid kitchenId, string userId);
        Task AddKitchenInvite(KitchenInvite invite);
        Task<KitchenInvite?> GetKitchenInvite(string inviteCode);
        Task AddUserKitchen(UserKitchen userKitchen);
    }
}