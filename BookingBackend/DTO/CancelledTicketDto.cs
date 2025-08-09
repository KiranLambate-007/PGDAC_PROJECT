namespace BookingBackend.DTO
{
    public class CancelledTicketDto
    {
        public string TicketId { get; set; }
        public string Reason { get; set; }
        public string RefundStatus { get; set; }
        public DateTime CancelledAt { get; set; }
    }
}
