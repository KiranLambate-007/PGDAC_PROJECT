using System.Collections.Generic;

namespace BookingBackend.Models
{
    public class ConfirmBookingRequest
    {
        public int BusId { get; set; }
        public string PaymentId { get; set; }
        public List<Seat> Seats { get; set; }
    }
}