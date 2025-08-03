using Microsoft.AspNetCore.Mvc.ModelBinding; // required
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
using BookingBackend.Models;


[Table("CancelledTickets")]
public class CancelledTicket
{
    [Key]
    public int CancelledId { get; set; }

    [Required]
    public int TicketId { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public string Reason { get; set; }

    [Required]
    public DateTime CancelledAt { get; set; }

    public string RefundStatus { get; set; }

    [BindNever]
    [JsonIgnore]
    [NotMapped]
    public Ticket Ticket { get; set; }

    [BindNever]
    [JsonIgnore]
    [NotMapped]
    public User User { get; set; }
}


