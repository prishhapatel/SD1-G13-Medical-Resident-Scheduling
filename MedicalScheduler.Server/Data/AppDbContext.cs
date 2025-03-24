using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Server.Models;

namespace MedicalScheduling.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Residents> Residents { get; set; }
    }
}
