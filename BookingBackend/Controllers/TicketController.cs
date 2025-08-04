using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookingBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Create multiple tickets in one API call.
        /// </summary>
        /// <param name="tickets">List of tickets to create</param>
        /// <returns>Created tickets</returns>
        [HttpPost]
        public async Task<IActionResult> CreateTickets([FromBody] List<Ticket> tickets)
        {
            if (tickets == null || tickets.Count == 0)
                return BadRequest(new { message = "No tickets provided." });

            foreach (var ticket in tickets)
            {
                ticket.BookingTime = DateTime.UtcNow;

                if (string.IsNullOrWhiteSpace(ticket.Status))
                    ticket.Status = "active";

                ticket.IsTransferred = false;

                // Optional: Additional validation can go here
                if (ticket.SeatNumber <= 0 || ticket.UserId <= 0 || ticket.AssignmentId <= 0)
                {
                    return BadRequest(new { message = "Invalid ticket data: SeatNumber, UserId and AssignmentId must be positive." });
                }
            }

            await _context.Tickets.AddRangeAsync(tickets);
            await _context.SaveChangesAsync();

            return Ok(tickets);
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

        /// <summary>
        /// Get single ticket by TicketId
        /// </summary>
        /// <param name="ticketId">Ticket Id</param>
        /// <returns>Ticket object</returns>
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
    }
}
