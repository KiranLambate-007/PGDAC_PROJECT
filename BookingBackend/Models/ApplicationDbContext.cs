using Microsoft.EntityFrameworkCore;
using System;

namespace BookingBackend.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Bus> Buses { get; set; }
    public DbSet<Route> Routes { get; set; }
    public DbSet<Stop> Stops { get; set; }
    public DbSet<BusRouteAssignment> BusRouteAssignments { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketTransfer> TicketTransfers { get; set; }
    public DbSet<Feedback> Feedbacks { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<QRTicket> QRTickets { get; set; }
    public DbSet<PostponedTicket> PostponedTickets { get; set; }
    


    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<TicketTransfer>()
        .HasOne(t => t.FromUser)
        .WithMany()
        .HasForeignKey(t => t.FromUserId)
        .OnDelete(DeleteBehavior.Restrict); // Optional: avoids cascading issues

    modelBuilder.Entity<TicketTransfer>()
        .HasOne(t => t.ToUser)
        .WithMany()
        .HasForeignKey(t => t.ToUserId)
        .OnDelete(DeleteBehavior.Restrict);

    // You can add more custom configs here if needed
}





}
