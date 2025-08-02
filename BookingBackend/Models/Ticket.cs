using System;

namespace BookingBackend.Models;

public class Ticket
{
    public int TicketId { get; set; }
    public int UserId { get; set; }
    public int AssignmentId { get; set; }
    public int SeatNumber { get; set; }
    public DateTime BookingTime { get; set; }
    public string Status { get; set; }

    public User User { get; set; }
    public BusRouteAssignment Assignment { get; set; }
}
