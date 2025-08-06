using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using BookingBackend.Models;  // Your model namespace


namespace BookingBackend.Controllers
{
    //[ApiController]
    //[Route("api/[controller]")]
    public class BusRouteAssignmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusRouteAssignmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/BusRouteAssignment?routeId=1&date=2025-08-04
        [HttpGet]
        public IActionResult GetAssignments([FromQuery] int? routeId, [FromQuery] DateTime? date)
        {
            var query = _context.BusRouteAssignments
                .Include(a => a.Bus)
                .Include(a => a.Route)
                .AsQueryable();

            if (routeId.HasValue)
            {
                query = query.Where(a => a.RouteId == routeId.Value);
            }

            if (date.HasValue)
            {
                // Filter assignments on the same day ignoring time
                query = query.Where(a => a.Date.Date == date.Value.Date);
            }

            var assignments = query.ToList();
            return Ok(assignments);
        }

        // POST: api/BusRouteAssignment
        [HttpPost]
        public IActionResult CreateAssignment([FromBody] BusRouteAssignment assignment)
        {
            if (assignment == null)
                return BadRequest("Invalid assignment data");

            // Optional: check if BusId and RouteId exist in DB (validation)

            assignment.Date = assignment.Date.Date; // Normalize date to date-only

            _context.BusRouteAssignments.Add(assignment);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAssignments), new { id = assignment.AssignmentId }, assignment);
        }

        // PUT: api/BusRouteAssignment/5
        [HttpPut("{id}")]
        public IActionResult UpdateAssignment(int id, [FromBody] BusRouteAssignment assignment)
        {
            if (id != assignment.AssignmentId)
                return BadRequest("Assignment ID mismatch");

            var existing = _context.BusRouteAssignments.Find(id);
            if (existing == null)
                return NotFound("Assignment not found");

            existing.BusId = assignment.BusId;
            existing.RouteId = assignment.RouteId;
            existing.Date = assignment.Date.Date;
            existing.StartTime = assignment.StartTime;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/BusRouteAssignment/5
        [HttpDelete("{id}")]
        public IActionResult DeleteAssignment(int id)
        {
            var assignment = _context.BusRouteAssignments.Find(id);
            if (assignment == null)
                return NotFound();

            _context.BusRouteAssignments.Remove(assignment);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
