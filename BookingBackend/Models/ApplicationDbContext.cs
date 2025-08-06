using feedback.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Add this:
    public DbSet<Feedback> Feedbacks { get; set; }

    // Other existing tables...
}


