using BookingBackend.DTO;
using BookingBackend.Models;
using Microsoft.AspNetCore.Mvc;
using BookingBackend.DTO;
using BookingBackend.Models;

namespace pmpml.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FeedbackController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PostFeedback([FromBody] FeedbackDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Comments))
            {
                return BadRequest("Invalid feedback data.");
            }

            var feedback = new Feedback
            {
                UserId = dto.UserId,
                TicketId = dto.TicketId,
                Comments = dto.Comments,
                SubmittedOn = DateTime.UtcNow
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully" });
        }
    }
}

