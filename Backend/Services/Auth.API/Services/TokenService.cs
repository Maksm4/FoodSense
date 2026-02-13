using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Auth.API.Services;

public class TokenService(IConfiguration configuration) : ITokenService
{
    public string? GenerateJwt(IdentityUser user)
    {
        var secretKey = configuration["JwtSettings:SecretKey"] 
                        ?? throw new InvalidOperationException("JWT Secret Key is missing in config");
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? "")
        };
        
        var token = new JwtSecurityToken(
            issuer: "https://Auth.API",
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(40), //for testing purpose set to 40 minutes
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}