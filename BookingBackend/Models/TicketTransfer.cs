using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookingBackend.Models;

public class TicketTransfer
{
    [Key]
    public int TransferId { get; set; }
    public int TicketId { get; set; }
    public int FromUserId { get; set; }
    public int ToUserId { get; set; }
    public DateTime TransferDate { get; set; }
    public string Status { get; set; }

    public Ticket Ticket { get; set; }

    [ForeignKey("FromUserId")]
    public User FromUser { get; set; }

    [ForeignKey("ToUserId")]
    public User ToUser { get; set; }
}
