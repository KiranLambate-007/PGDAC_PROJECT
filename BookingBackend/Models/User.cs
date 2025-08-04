using System;

namespace BookingBackend.Models;

public class User
{
    public int UserId { get; set; }
    
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public string AadharCardNumber { get; set; } = string.Empty;

    public ICollection<Ticket> Tickets { get; set; }
    public ICollection<TicketTransfer> TransfersFrom { get; set; }
    public ICollection<TicketTransfer> TransfersTo { get; set; }
    public ICollection<Feedback> Feedbacks { get; set; }
}
