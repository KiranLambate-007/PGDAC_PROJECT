using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookingBackend.Models;
using BookingBackend.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookingBackend.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    public class CancelledTicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CancelledTicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CancelledTicket>>> GetAll()
        {
            return await _context.Cancellations.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CancelledTicket>> GetById(int id)
        {
            var cancellation = await _context.Cancellations.FindAsync(id);
            if (cancellation == null)
                return NotFound();

            return cancellation;
        }

        [HttpPost("cancelledTickets")]
        //public async Task<ActionResult<CancelledTicket>> Create([FromBody] CancelledTicketDto dto)
        public async Task<IActionResult> CreateTickets([FromBody] CancelledTicketDto dto)
        {

            if(dto == null)
            {
                return BadRequest(new { error = "ticket is invalid" });
            }
            var cancelledTicket = new CancelledTicket
            {
                TicketId = int.Parse(dto.TicketId),
                Reason = dto.Reason,
                CancelledAt = dto.CancelledAt,
                RefundStatus = dto.RefundStatus
            };

            _context.Cancellations.Add(cancelledTicket);
            await _context.SaveChangesAsync();

            //return CreatedAtAction(nameof(GetById), new { id = cancelledTicket.CancelledId }, cancelledTicket);
            return Ok(dto);
        }


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
