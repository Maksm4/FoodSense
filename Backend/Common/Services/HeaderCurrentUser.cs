using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Common.Services;

public class HeaderCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public string? UserId
    {
        get
        {
            var user = httpContextAccessor.HttpContext?.User;

            return user?.FindFirstValue(ClaimTypes.NameIdentifier)
                   ?? null;
        }
    }
}