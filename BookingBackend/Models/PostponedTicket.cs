
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace BookingBackend.Models;

[Table("PostponedTickets")]
public class PostponedTicket
{
    [Key]
    public int PostponedId { get; set; }

    public int TicketId { get; set; }
    public int UserId { get; set; }

    public DateTime OriginalDate { get; set; }
    public DateTime NewDate { get; set; }

    public int OriginalAssignment { get; set; }
    public int NewAssignment { get; set; }

    public string Status { get; set; }
    public string Reason { get; set; }

    public DateTime RequestedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    [JsonIgnore]
    [ValidateNever] // <-- THIS FIXES THE VALIDATION ERROR
    public Ticket Ticket { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public User User { get; set; }
}
