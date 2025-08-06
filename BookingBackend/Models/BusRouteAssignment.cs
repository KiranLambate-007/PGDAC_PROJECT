using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookingBackend.Models;

public class BusRouteAssignment
{
    [Key]
    public int AssignmentId { get; set; }
    public int BusId { get; set; }
    public int RouteId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }

    [ForeignKey("BusId")]
    public Bus Bus { get; set; }

    [ForeignKey("RouteId")]
    public Route Route { get; set; }
}
