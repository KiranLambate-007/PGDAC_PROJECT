using BookingBackend.DTO;
using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Route = BookingBackend.Models.Route;

namespace BookingBackend.Controllers
{

    public class RouteController : Controller
    {

        private readonly ApplicationDbContext _context;

        public IActionResult Index()
        {
            return View();
        }

        public RouteController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("routes")]
        public async Task<IActionResult> GetAllRoutesAsync()
        {
            //var routes = await _context.Routes
            //.Include(r => r.Stops)
            //.Include(r => r.BusRouteAssignments)
            //.ToListAsync();

            //return Ok(routes);

            var routes = await _context.Routes
        .Include(r => r.Stops)
        .Include(r => r.BusRouteAssignments)
            .ThenInclude(bra => bra.Bus) // ✅ Include related bus info if needed
        .ToListAsync();

            return Ok(routes);
        }

        [HttpGet("route/{id}")]
        public async Task<ActionResult<Route>> GetRouteById(int id)
        {
            var route = await _context.Routes
                .Include(r => r.BusRouteAssignments)
                    .ThenInclude(bra => bra.RouteId)
                .Include(r => r.Stops)
                .FirstOrDefaultAsync(r => r.RouteId == id);

            if (route == null)
                return NotFound();

            return Ok(route);
        }


    }
}
