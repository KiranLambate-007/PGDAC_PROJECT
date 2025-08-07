using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace BookingBackend.Controllers
{
    public class TicketTransferController : Controller
    {

        private readonly ApplicationDbContext _context;

        public TicketTransferController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> TransferTicket([FromBody] DTO.TicketTransferRequest request)
        {
            // Load ticket with owner
            var ticket = await _context.Tickets.Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TicketId == request.TicketId);
            if (ticket == null)
                return NotFound("Ticket not found.");

            // Validate ticket eligibility
            if (ticket.Status == "Used")
                return BadRequest("Ticket already used.");

            if (ticket.IsTransferred)
                return BadRequest("Ticket has already been transferred once.");

            if (DateTime.UtcNow > ticket.BookingTime)
                return BadRequest("Ticket transfer window expired (start time passed).");

            // Find recipient user
            var recipient = await _context.Users.FirstOrDefaultAsync(u =>
                u.PhoneNumber == request.RecipientPhoneOrEmailOrUserId ||
                u.Email == request.RecipientPhoneOrEmailOrUserId ||
                u.UserId.ToString() == request.RecipientPhoneOrEmailOrUserId);

            if (recipient == null)
                return NotFound("Recipient user not found.");

            // Check recipient eligibility (no active ticket for same assignment and start time)
            bool recipientHasActiveTicket = await _context.Tickets.AnyAsync(t =>
                t.UserId == recipient.UserId &&
                !t.IsTransferred &&
                t.Status != "Used" &&
                t.BookingTime == ticket.BookingTime &&
                t.AssignmentId == ticket.AssignmentId);

            if (recipientHasActiveTicket)
                return BadRequest("Recipient already has an active ticket for this route and time.");

            // Create transfer record - Pending
            var transfer = new TicketTransfer
            {
                TicketId = ticket?.TicketId ?? 0, // fallback to 0 if ticket is null
                //FromUserId = ticket.UserId,
                FromUserId = ticket.UserId ?? 0, // or any default UserId (like -1 or throw),
                ToUserId = recipient.UserId,
                TransferDate = DateTime.UtcNow,
                Status = "Pending"
            };

            await _context.TicketTransfers.AddAsync(transfer);

            // Update ticket ownership and status
            ticket.UserId = recipient.UserId;
            ticket.IsTransferred = true;
            ticket.Status = "Transferred";

            await _context.SaveChangesAsync();

            // Mark transfer as Completed
            transfer.Status = "Completed";
            await _context.SaveChangesAsync();

            // Simulate notifications
            Console.WriteLine($"Notification: Ticket {ticket.TicketId} transferred from User {transfer.FromUserId} to User {transfer.ToUserId}.");

            return Ok(new
            {
                Message = "Ticket transfer successful.",
                TicketId = ticket.TicketId,
                NewOwnerId = recipient.UserId
            });
        }
    }
}
