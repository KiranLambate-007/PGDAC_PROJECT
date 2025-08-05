using System;

namespace BookingBackend.Models
{
    public class LoginRequest
    {
        public int LoginId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
