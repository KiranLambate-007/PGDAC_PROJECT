using System;
using System.ComponentModel.DataAnnotations;

namespace BookingBackend.Models;

public class BusRouteAssignment
{
    [Key]
    public int AssignmentId { get; set; }
    public int BusId { get; set; }
    public int RouteId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }

    public Bus Bus { get; set; }
    public Route Route { get; set; }
}
