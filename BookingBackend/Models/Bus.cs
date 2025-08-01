using System;

namespace BookingBackend.Models;

public class Bus
{
    public int BusId { get; set; }
    public string BusNumber { get; set; }
    public string BusType { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; }

    public ICollection<BusRouteAssignment> BusRouteAssignments { get; set; }
}
