using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using feedback.Models;
using feedback.DTO;
using Microsoft.EntityFrameworkCore.Design;

[Route("api/[controller]")]
[ApiController]
public class FeedbackController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FeedbackController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/Feedback
    [HttpPost]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackDto feedbackDto)
    {
        var feedback = new Feedback
        {
            UserId = feedbackDto.UserId,
            Message = feedbackDto.Message,
            Rating = feedbackDto.Rating
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Feedback submitted successfully" });
    }

    // GET: api/Feedback
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacks()
    {
        return await _context.Feedbacks
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }
}

