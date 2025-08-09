using Azure.Core;
using BookingBackend.DTO;
using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookingBackend.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class TicketTransferController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketTransferController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> TransferTicket([FromBody] TicketTransferRequest request)
        {
            try
            {
                if (request == null)
                    return BadRequest(new { message = "Invalid transfer request." });

                var ticket = await _context.Tickets
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.TicketId == request.TicketId);

                if (ticket == null)
                    return NotFound(new { message = "Ticket not found." });

                if (ticket.Status == "Used")
                    return BadRequest(new { message = "Ticket already used." });

                if (ticket.IsTransferred)
                    return BadRequest(new { message = "Ticket has already been transferred once." });

                //var recipient = await _context.Users.FirstOrDefaultAsync(u =>
                //    u.Email == request.ToUserId);

                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.ToUserId);
                if (existingUser == null)
                    //return BadRequest("Email already registered.");
                    return BadRequest(new { message = "recipient Email not present so not transfer ticket" });

                //bool recipientHasActiveTicket = await _context.Tickets.AnyAsync(t =>
                //t.UserId == recipient.UserId &&
                //!t.IsTransferred &&
                //t.Status != "Used" &&
                //t.BookingTime == ticket.BookingTime &&
                //t.AssignmentId == ticket.AssignmentId);

                //if (recipientHasActiveTicket)
                //    return BadRequest(new { message = "Recipient already has an active ticket for this route and time." });

                var transfer = new TicketTransfer
                {
                    TicketId = request.TicketId,
                    FromUserId = int.Parse(request.FromUserId),
                    ToUserId = existingUser.UserId,
                    TransferDate = DateTime.UtcNow,
                    Status = "Transferred"
                };

                await _context.TicketTransfers.AddAsync(transfer);

                //ticket.UserId = recipient.UserId;
                //ticket.IsTransferred = true;
                //ticket.Status = "Transferred";

                await _context.SaveChangesAsync();

                //transfer.Status = "Completed";
                //await _context.SaveChangesAsync();

                Console.WriteLine($"Notification: Ticket {ticket.TicketId} transferred from User {transfer.FromUserId} to User {transfer.ToUserId}.");

                return Ok(new
                {
                    message = "Ticket transfer successful."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[TransferTicket] ERROR: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred during transfer.", detail = ex.Message });
            }
        }

        [HttpGet("GetAllTickets")]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(b => b.Assignment)
                    .ThenInclude(bra => bra.Route)
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPatch("update/transferUserId/{userId}")]
        public async Task<IActionResult> UpdatetransferUserId([FromBody] TicketTransferRequest update, int userId)
        {
            var status = update.Status;
            var email = update.ToUserId;

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == update.ToUserId);
            if (existingUser == null)
                //return BadRequest("Email already registered.");
                return BadRequest(new { message = "recipient Email not present so not transfer ticket" });



            if (status == null)
                return BadRequest(new { error = "status in invalid" });

            var ticket = await _context.Tickets.FindAsync(userId);
            if (ticket == null)
                return BadRequest(new { error = "ticket is not found" });

            ticket.Status = status;
            ticket.UserId = existingUser.UserId;

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
