using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookingBackend.Models
{
    [Table("CancelledTickets")]
    public class CancelledTicket
    {
        [Key]
        public int CancelledId { get; set; }

        
        public int TicketId { get; set; }

        
        public string Reason { get; set; }

        [Required]
        public DateTime CancelledAt { get; set; }

        public string RefundStatus { get; set; }

        [BindNever]
        [JsonIgnore]
        [NotMapped]
        public Ticket Ticket { get; set; }

      
    }
}
