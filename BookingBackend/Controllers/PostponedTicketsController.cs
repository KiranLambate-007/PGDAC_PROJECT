using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostponedTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostponedTicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PostponedTickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostponedTicket>>> GetPostponedTickets()
        {
            return await _context.PostponedTickets
                .Include(p => p.Ticket)
                .Include(p => p.User)
                .ToListAsync();
        }

        // GET: api/PostponedTickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostponedTicket>> GetPostponedTicket(int id)
        {
            var ticket = await _context.PostponedTickets
                .Include(p => p.Ticket)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostponedId == id);

            if (ticket == null)
                return NotFound();

            return ticket;
        }

        // POST: api/PostponedTickets
        [HttpPost]
        public async Task<ActionResult<PostponedTicket>> CreatePostponedTicket(PostponedTicket ticket)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // <-- Add this to see what's wrong
            }
            _context.PostponedTickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostponedTicket), new { id = ticket.PostponedId }, ticket);
        }

        // PUT: api/PostponedTickets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePostponedTicket(int id, PostponedTicket updatedTicket)
        {
            if (id != updatedTicket.PostponedId)
                return BadRequest();

            _context.Entry(updatedTicket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.PostponedTickets.Any(p => p.PostponedId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/PostponedTickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostponedTicket(int id)
        {
            var ticket = await _context.PostponedTickets.FindAsync(id);
            if (ticket == null)
                return NotFound();

            _context.PostponedTickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

