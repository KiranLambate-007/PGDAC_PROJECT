using System;
using System.ComponentModel.DataAnnotations;

namespace BookingBackend.Models;

public class PostponedTicket
{
    [Key]
    public int PostponedId { get; set; }
    public int TicketId { get; set; }
    public int UserId { get; set; }
    public DateTime OriginalDate { get; set; }
    public DateTime NewDate { get; set; }
    public int OriginalAssignment { get; set; }
    public int NewAssignment { get; set; }
    public string Status { get; set; }
    public string Reason { get; set; }
    public DateTime RequestedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Ticket Ticket { get; set; }
    public User User { get; set; }
}
