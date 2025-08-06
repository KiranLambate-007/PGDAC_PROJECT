using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingBackend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] Payment payment)
        {
            if (!_context.Tickets.Any(t => t.TicketId == payment.TicketId))
            {
                return BadRequest("Invalid TicketId.");
            }

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return Ok(payment);
        }

        [HttpGet("ticket/{ticketId}")]
        public async Task<IActionResult> GetPaymentByTicketId(int ticketId)
        {
            var payment = await _context.Payments
                .Where(p => p.TicketId == ticketId)
                .FirstOrDefaultAsync();

            if (payment == null) return NotFound();
            return Ok(payment);
        }
    }
}
