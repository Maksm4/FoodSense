using Inventory.API.Data.Context;
using Inventory.API.Data.Interfaces;
using Inventory.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Inventory.API.Data.Repository
{
    public class KitchenRepository(InventoryDbContext context) : GenericRepository<Kitchen>(context), IKitchenRepository
    {
        private readonly InventoryDbContext _context = context;
        
        public async Task<IEnumerable<Kitchen>> GetAll(string userId)
        {
            return await _context.Kitchens
                .Include(k => k.UserKitchens)
                .Where(k => k.UserKitchens.Any(u => u.UserId == userId))
                .ToListAsync();
                
        }

        public async Task<bool> IsUserMember(Guid kitchenId, string userId)
        {
            return await _context.UserKitchens
                .AnyAsync(uk => uk.KitchenId == kitchenId && uk.UserId == userId);
        }

        public Task<bool> IsUserOwner(Guid kitchenId, string userId)
        {
            return _context.UserKitchens
                .AnyAsync(uk => uk.KitchenId == kitchenId && uk.UserId == userId && uk.Role == UserKitchenRole.Owner);
        }
        
        public async Task AddKitchenInvite(KitchenInvite invite)
        {
            await _context.KitchenInvites.AddAsync(invite);
            await _context.SaveChangesAsync();
        }

        public async Task<KitchenInvite?> GetKitchenInvite(string inviteCode)
        {
            return await _context.KitchenInvites
                .Where(k => k.ExpiresAt > DateTime.UtcNow)
                .FirstOrDefaultAsync();
        }
        
        public async Task AddUserKitchen(UserKitchen userKitchen)
        {
            var existing = await _context.UserKitchens
                .FirstOrDefaultAsync(uk => uk.KitchenId == userKitchen.KitchenId && uk.UserId == userKitchen.UserId);
            
            if (existing == null)
            {
                await _context.UserKitchens.AddAsync(userKitchen);
                await _context.SaveChangesAsync();
            }
        }
    }
}