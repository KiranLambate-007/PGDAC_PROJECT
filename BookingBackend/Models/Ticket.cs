using System;

namespace BookingBackend.Models;

public class Ticket
{
    //internal bool IsTransferred;

    public int TicketId { get; set; }
    public int UserId { get; set; }
    public int AssignmentId { get; set; }
    public int SeatNumber { get; set; }
    public DateTime BookingTime { get; set; }
    public bool IsTransferred { get; set; }
    public string Status { get; set; }

    public User User { get; set; }
    public BusRouteAssignment Assignment { get; set; }
    public Bus Bus { get; set; }
}
