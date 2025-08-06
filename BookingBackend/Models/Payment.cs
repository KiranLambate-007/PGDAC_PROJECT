using System;
namespace BookingBackend.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }

        public int TicketId { get; set; }  // Foreign key to Ticket table
        public Ticket Ticket { get; set; } // Navigation property

        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } // UPI, Card, etc.
        public string PaymentStatus { get; set; } // Success, Failed, etc.
        public string RazorpayPaymentId { get; set; } // From Razorpay
        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
