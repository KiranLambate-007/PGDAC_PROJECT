using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookingBackend.Models;

public class Ticket
{
    //internal bool IsTransferred;

    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //ensures auto-increment
    public int TicketId { get; set; }
    public int? UserId { get; set; }

    [JsonIgnore]
    //public int AssignmentId { get; set; }
    public int? AssignmentId { get; set; } // make it nullable
    public string SeatNumber { get; set; }
    public DateTime BookingTime { get; set; }
    public bool IsTransferred { get; set; }
    public string Status { get; set; }

    [JsonIgnore]
    public User User { get; set; }

    [JsonIgnore]
    public BusRouteAssignment Assignment { get; set; }

   
    public int? BusId { get; set; }

    [JsonIgnore]
    [ForeignKey("BusId")]
    public Bus Bus { get; set; }

}
