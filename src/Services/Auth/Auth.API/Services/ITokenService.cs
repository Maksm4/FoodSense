using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Auth.API.Services;

public interface ITokenService
{
    string? GenerateJwt(IdentityUser user);
}