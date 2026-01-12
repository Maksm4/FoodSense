using Microsoft.AspNetCore.Http;

namespace Common.Services;

public class HeaderCurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    public string? UserId
    {
        get
        {
            var context = httpContextAccessor.HttpContext;
            if (context != null && context.Request.Headers.TryGetValue("X-User-Id", out var userIdHeader))
            {
                return userIdHeader.ToString();
            }
            return null;
        }
    }
}