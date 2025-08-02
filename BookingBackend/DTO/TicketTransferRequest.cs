namespace BookingBackend.DTO
{
    public class TicketTransferRequest
    {
        public int TicketId { get; set; }
        public string RecipientPhoneOrEmailOrUserId { get; set; }
    }
}
