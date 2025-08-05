using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//[ApiController]
//[Route("api/[controller]")]
public class BusController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BusController(ApplicationDbContext context)
    {
        _context = context;
    }

     [HttpGet("Bus/search")]
    public async Task<IActionResult> SearchRoutes([FromQuery] string source, [FromQuery] string destination, [FromQuery] DateTime datetime)
    {
        // ✅ Log incoming values
        Console.WriteLine($"[Route Search] Source: '{source}', Destination: '{destination}'");

        if (string.IsNullOrWhiteSpace(source) || string.IsNullOrWhiteSpace(destination))
        {
            return BadRequest("Source and destination, datetime are required.");
        }

        // ✅ Normalize input
        string normalizedSource = source.Trim().ToLower();
        string normalizedDestination = destination.Trim().ToLower();
        DateTime normalizedDatetime = datetime;

        // ✅ Log before query
        Console.WriteLine("[Route Search] Normalized search...");

        // ✅ Run query
        var routes = await _context.Routes
            .Include(r => r.BusRouteAssignments)  // Optional: include buses on the route
            .Where(r =>
                r.Source.ToLower().Trim() == normalizedSource &&
                r.Destination.ToLower().Trim() == normalizedDestination &&
                r.DateTime  > normalizedDatetime)
            .ToListAsync();

        // ✅ Log result
        Console.WriteLine($"[Route Search] Found {routes.Count} matching routes.");

        if (!routes.Any())
        {
            return NotFound("No matching routes found.");
        }

        return Ok(routes);
    }
}

