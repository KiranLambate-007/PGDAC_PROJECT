using System;

namespace BookingBackend.Models;

public class Payment
{
    public int PaymentId { get; set; }
    public int TicketId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; }
    public string Status { get; set; }
    public DateTime PaymentTime { get; set; }

    public Ticket Ticket { get; set; }
}
