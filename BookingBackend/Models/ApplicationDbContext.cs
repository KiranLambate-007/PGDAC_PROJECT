using Microsoft.EntityFrameworkCore;
using System;

namespace BookingBackend.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    public DbSet<Seat> Seats { get; set; }

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

    public DbSet<CancelledTicket> Cancellations { get; set; }

    public DbSet<RegisterRequest> RegisterRequests { get; set; }




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

        modelBuilder.Entity<Feedback>()
            .HasOne(t => t.Ticket)
            .WithMany()
            .HasForeignKey(t => t.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Feedback>()
           .HasOne(t => t.User)
           .WithMany()
           .HasForeignKey(t => t.UserId)
           .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<PostponedTicket>()
           .HasOne(t => t.User)
           .WithMany()
           .HasForeignKey(t => t.UserId)
           .OnDelete(DeleteBehavior.Restrict); // Or .NoAction

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2); // Or whatever fits your use case

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Bus)
            .WithMany()
            .HasForeignKey(t => t.TicketId)
            .OnDelete(DeleteBehavior.Restrict); // 👈 This avoids cascade conflict

        modelBuilder.Entity<BusRouteAssignment>()
       .HasOne(bra => bra.Bus)
       .WithMany(b => b.BusRouteAssignments)
       .HasForeignKey(bra => bra.BusId);

        modelBuilder.Entity<BusRouteAssignment>()
            .HasOne(bra => bra.Route)
            .WithMany(r => r.BusRouteAssignments)
            .HasForeignKey(bra => bra.RouteId);

        modelBuilder.Entity<BusRouteAssignment>()
        .HasOne(bra => bra.Route)
        .WithMany(r => r.BusRouteAssignments)
        .HasForeignKey(bra => bra.RouteId)
        .OnDelete(DeleteBehavior.Restrict); // 👈 Prevents cascade delete

        modelBuilder.Entity<Bus>()
            .HasOne(b => b.Route)
            .WithMany(r => r.Buses)
            .HasForeignKey(b => b.RouteId)
            .OnDelete(DeleteBehavior.Restrict); // Optional: also make this explicit
    }



    // You can add more custom configs here if needed

}
