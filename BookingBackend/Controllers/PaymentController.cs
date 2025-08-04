using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using BookingBackend.Models;


namespace BookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Payment
        // Get all payments (you can restrict or paginate this in real apps)
        [HttpGet]
        public ActionResult<IEnumerable<Payment>> GetPayments()
        {
            var payments = _context.Payments
                .Include(p => p.Ticket)
                .ToList();

            return Ok(payments);
        }

        // GET: api/Payment/5
        [HttpGet("{id}")]
        public ActionResult<Payment> GetPayment(int id)
        {
            var payment = _context.Payments
                .Include(p => p.Ticket)
                .FirstOrDefault(p => p.PaymentId == id);

            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        // POST: api/Payment
        // Save new payment record after successful payment
        [HttpPost]
        public ActionResult<Payment> CreatePayment([FromBody] Payment payment)
        {
            if (payment == null)
                return BadRequest("Invalid payment data");

            payment.PaymentTime = DateTime.UtcNow;

            _context.Payments.Add(payment);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentId }, payment);
        }

        // PUT: api/Payment/5
        // Update payment info (optional)
        [HttpPut("{id}")]
        public IActionResult UpdatePayment(int id, [FromBody] Payment updatedPayment)
        {
            if (id != updatedPayment.PaymentId)
                return BadRequest("Payment ID mismatch");

            var payment = _context.Payments.Find(id);
            if (payment == null)
                return NotFound();

            payment.Amount = updatedPayment.Amount;
            payment.Method = updatedPayment.Method;
            payment.Status = updatedPayment.Status;
            payment.PaymentTime = updatedPayment.PaymentTime;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Payment/5
        [HttpDelete("{id}")]
        public IActionResult DeletePayment(int id)
        {
            var payment = _context.Payments.Find(id);
            if (payment == null)
                return NotFound();

            _context.Payments.Remove(payment);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
