using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingBackend.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }


        //public async Task<IActionResult> CreateTickets([FromBody] List<Ticket> tickets)
        [HttpPost("confirm/ticketBooking")]
        public async Task<IActionResult> CreateTickets([FromBody] Ticket ticket)
        {
            if (ticket == null)
            return BadRequest(new { error = "Invalid seat payload" });

            //foreach (var ticket in tickets)
            //{
            ticket.BookingTime = DateTime.UtcNow;

                if (string.IsNullOrWhiteSpace(ticket.Status))
                    ticket.Status = "active";

                ticket.IsTransferred = false;

                // Optional: Additional validation can go here
                //if (ticket.SeatNumber <= 0)
                //{
                //    return BadRequest(new { message = "Invalid ticket data: SeatNumber, UserId and AssignmentId must be positive." });
                //}
            //}

            //await _context.Tickets.AddRangeAsync(tickets);
            //await _context.SaveChangesAsync();
            //_context.Tickets.Add(ticket);
            //_context.SaveChanges();
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();  // Now ticket.TicketId is set by DB

            return Ok(ticket);
        }

        /// <summary>
        /// Get all tickets for a given user by user id.
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns>List of tickets</returns>
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetTicketsByUser(int userId)
        {
            var tickets = await _context.Tickets
                .Where(t => t.UserId == userId)
                .Include(t => t.Assignment)
                .Include(t => t.User)
                .Include(t => t.Bus)
                .ToListAsync();

            if (tickets == null || tickets.Count == 0)
                return NotFound(new { message = $"No tickets found for user with ID {userId}." });

            return Ok(tickets);
        }

        
        [HttpGet("{ticketId}")]
        public async Task<IActionResult> GetTicket(int ticketId)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Assignment)
                .Include(t => t.User)
                .Include(t => t.Bus)
                .FirstOrDefaultAsync(t => t.TicketId == ticketId);

            if (ticket == null)
                return NotFound(new { message = $"Ticket with ID {ticketId} not found." });

            return Ok(ticket);
        }

        [HttpPatch("update/{userId}")]
        public async Task<IActionResult> UpdateTicketStatus([FromBody] Ticket update, int userId)
        {
            var time = update.BookingTime;

            if (time == null)
                return BadRequest(new { error = "status in invalid" });

            var ticket = await _context.Tickets.FindAsync(userId);
            if (ticket == null)
                return BadRequest(new { error = "ticket is not found" });

            ticket.BookingTime = time;

            try
            {
                _context.Tickets.Update(ticket);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return BadRequest(new { error = "error occured while updating ticket status" });
            }

            return Ok(ticket);
        }
    }
}
