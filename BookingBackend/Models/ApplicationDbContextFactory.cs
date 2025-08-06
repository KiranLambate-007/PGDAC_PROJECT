using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using feedback.Models;

public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

        // Use your actual connection string here
        optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=pmpml;Trusted_Connection=True;");

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}

