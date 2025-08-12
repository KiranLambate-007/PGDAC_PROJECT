using System;

namespace BookingBackend.Models;

public class Feedback
{
    public int FeedbackId { get; set; }
    public int UserId { get; set; }
    //public int TicketId { get; set; }
    public int Rating { get; set; }
    public string Comments { get; set; }
    public DateTime SubmittedOn { get; set; }

    public User User { get; set; }
    public Ticket Ticket { get; set; }
}
