using Auth.API.DTOs;
using Auth.API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auth.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ITokenService tokenService, UserManager<IdentityUser> userManager) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user is null) return Unauthorized("Invalid credentials");
        
        var isPasswordValid = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid) return Unauthorized("Invalid credentials");
        
        var token = tokenService.GenerateJwt(user);

        return Ok(new { Token = token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var userExists = await userManager.FindByEmailAsync(dto.Email);
        if (userExists != null) return BadRequest("Email is already in use.");

        var usernameExists = await userManager.FindByNameAsync(dto.Username);
        
        if (usernameExists != null) return BadRequest("Username is already taken.");
        var user = new IdentityUser { UserName = dto.Username, Email = dto.Email };
        
        var result = await userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded) return BadRequest(result.Errors);

        return Ok("User registered successfully");
    }
}