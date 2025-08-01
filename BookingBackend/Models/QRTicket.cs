using System;

namespace BookingBackend.Models;

public class QRTicket
{
    public int QRTicketId { get; set; }
    public int TicketId { get; set; }
    public string QrCodeUrl { get; set; }
    public DateTime GeneratedTime { get; set; }
    public bool SentToWhatsapp { get; set; }

    public Ticket Ticket { get; set; }
}
