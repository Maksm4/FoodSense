using System.ComponentModel.DataAnnotations;

namespace Auth.API.DTOs;

public class RegisterDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(4)] 
    public string Username { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
        
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = string.Empty;
}