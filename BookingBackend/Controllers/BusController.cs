using Microsoft.AspNetCore.Mvc;
using BookingBackend.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class BusController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BusController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("byRoute/{routeId}")]
    public async Task<IActionResult> GetBusesByRoute(int routeId)
    {
        var buses = await _context.BusRouteAssignments
            .Where(b => b.RouteId == routeId)
            .ToListAsync();

        return Ok(buses);
    }
}
