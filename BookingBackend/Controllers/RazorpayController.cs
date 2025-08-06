using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using System;
using System.Collections.Generic;

namespace BookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RazorpayController : ControllerBase
    {
        private readonly string _key = "rzp_test_uyfP9qWStu9InV";
        private readonly string _secret = "DVzqGxrTM80Iob8keULHPKCV";

        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] PaymentRequest request)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(_key, _secret);

                Dictionary<string, object> options = new Dictionary<string, object>
                {
                    { "amount", request.Amount * 100 }, // amount in paise
                    { "currency", "INR" },
                    { "receipt", $"rcpt_{Guid.NewGuid()}" },
                    { "payment_capture", 1 }
                };

                Order order = client.Order.Create(options);

                return Ok(new
                {
                    orderId = order["id"].ToString(),
                    amount = request.Amount,
                    currency = "INR",
                    key = _key
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create Razorpay order", error = ex.Message });
            }
        }
    }

    public class PaymentRequest
    {
        public int Amount { get; set; }
    }
}
