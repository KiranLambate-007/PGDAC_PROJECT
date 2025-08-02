using System;

namespace BookingBackend.Models;

public class Stop
{
    public int StopId { get; set; }
    public int RouteId { get; set; }
    public string StopName { get; set; }
    public TimeSpan ArrivalTime { get; set; }
    public int StopOrder { get; set; }

    public Route Route { get; set; }
}
