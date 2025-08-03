using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingBackend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CancelledTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CancelledTicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CancelledTickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CancelledTicket>>> GetAll()
        {
            return await _context.Cancellations
                .ToListAsync();
        }

        // GET: api/CancelledTickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CancelledTicket>> GetById(int id)
        {
            var cancellation = await _context.Cancellations
                .FirstOrDefaultAsync(c => c.CancelledId == id);

            if (cancellation == null)
                return NotFound();

            return cancellation;
        }

        // POST: api/CancelledTickets
        [HttpPost]
        public async Task<ActionResult<CancelledTicket>> Create(CancelledTicket ticket)
        {
            _context.Cancellations.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = ticket.CancelledId }, ticket);
        }

        // PUT: api/CancelledTickets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CancelledTicket updated)
        {
            if (id != updated.CancelledId)
                return BadRequest();

            _context.Entry(updated).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cancellations.Any(c => c.CancelledId == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        // DELETE: api/CancelledTickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cancellation = await _context.Cancellations.FindAsync(id);
            if (cancellation == null)
                return NotFound();

            _context.Cancellations.Remove(cancellation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}


