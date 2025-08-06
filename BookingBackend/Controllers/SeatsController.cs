using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using BookingBackend.Models;


namespace BookingBackend.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class SeatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeatController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Seat?busId=5
        // Get all seats for a specific bus
        [HttpGet]
        public ActionResult<IEnumerable<Seat>> GetSeats([FromQuery] int busId)
        {
            if (busId <= 0)
                return BadRequest("Invalid busId");

            var seats = _context.Seats
                .Where(s => s.BusId == busId)
                .ToList();

            return Ok(seats);
        }

        // GET: api/Seat/5
        [HttpGet("{id}")]
        public ActionResult<Seat> GetSeat(int id)
        {
            var seat = _context.Seats.Find(id);

            if (seat == null)
                return NotFound();

            return Ok(seat);
        }

        // POST: api/Seat
        // Add new seat (typically admin or setup, not user booking)
        [HttpPost]
        public ActionResult<Seat> CreateSeat([FromBody] Seat seat)
        {
            if (seat == null)
                return BadRequest();

            _context.Seats.Add(seat);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetSeat), new { id = seat.Id }, seat);
        }

        // PUT: api/Seat/5
        // Update seat details (e.g. mark seat as occupied or available)
        [HttpPut("{id}")]
        public IActionResult UpdateSeat(int id, [FromBody] Seat updatedSeat)
        {
            if (id != updatedSeat.Id)
                return BadRequest();

            var seat = _context.Seats.Find(id);
            if (seat == null)
                return NotFound();

            seat.SeatNumber = updatedSeat.SeatNumber;
            seat.IsOccupied = updatedSeat.IsOccupied;
            seat.Price = updatedSeat.Price;
            seat.BusId = updatedSeat.BusId;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Seat/5
        [HttpDelete("{id}")]
        public IActionResult DeleteSeat(int id)
        {
            var seat = _context.Seats.Find(id);
            if (seat == null)
                return NotFound();

            _context.Seats.Remove(seat);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
