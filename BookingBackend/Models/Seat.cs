using System;

namespace BookingBackend.Models;
public class Seat
{
    public int Id { get; set; }
    public string SeatNumber { get; set; }
    public bool IsOccupied { get; set; }
    public decimal Price { get; set; }

    // Foreign key if you connect to a specific bus
    public int BusId { get; set; }
    public Bus Bus { get; set; }
}
