using System;

namespace BookingBackend.Models;

public class Route
{
    public int RouteId { get; set; }
    public string Source { get; set; }
    public string Destination { get; set; }
    public float DistanceKm { get; set; }
    public TimeSpan EstimatedTime { get; set; }

    //public DateTime DateTime { get; set; }

    //public float Price { get; set; }

    public ICollection<Stop> Stops { get; set; }
    public ICollection<Bus> Buses { get; set; }

    public ICollection<BusRouteAssignment> BusRouteAssignments { get; set; }
}
