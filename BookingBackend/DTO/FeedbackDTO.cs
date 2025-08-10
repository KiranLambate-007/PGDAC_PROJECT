namespace BookingBackend.DTO
{
    public class FeedbackDTO
    {
        public int UserId { get; set; }
        public int TicketId { get; set; }
        public string Comments{ get; set; }
        public int Rating { get; set; }
    }
}
