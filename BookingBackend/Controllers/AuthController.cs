using Microsoft.AspNetCore.Mvc;
using BookingBackend.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt = BCrypt.Net.BCrypt;
namespace BCrypt.Net.Admin;

public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        //if (!ModelState.IsValid)
        //    return BadRequest(ModelState);

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (existingUser != null)
            //return BadRequest("Email already registered.");
            return BadRequest(new { message = "Email already registered." });

        var newUser = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            Password = BCrypt.HashPassword(request.Password), // ✅ Hashed
            PhoneNumber = request.PhoneNumber,
            AadharCardNumber = request.AadharNumber
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully", userId = newUser.UserId });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        //if (!ModelState.IsValid)
        //    return BadRequest(ModelState);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Verify(request.Password, user.Password)) //  Verify hash
            return Unauthorized("Invalid email or password.");

        return Ok(new { message = "Login successful", userId = user.UserId, fullName = user.FullName });
    }
}
