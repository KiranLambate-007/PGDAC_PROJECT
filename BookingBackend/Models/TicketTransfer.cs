using System;
using System.ComponentModel.DataAnnotations;

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
    public User FromUser { get; set; }
    public User ToUser { get; set; }
}
