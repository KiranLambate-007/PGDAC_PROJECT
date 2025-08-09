namespace BookingBackend.DTO
{
    public class TicketTransferRequest
    {
        public int TicketId { get; set; }

        public string FromUserId { get; set; }

        public string ToUserId { get; set; }

        public DateTime TransferDate { get; set; }

        public string Status { get; set; }
        //public string RecipientPhoneOrEmailOrUserId { get; set; }
    }
}
