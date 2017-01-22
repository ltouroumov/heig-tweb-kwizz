using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KwizzApi.Models {
    public class KwizzContext : IdentityDbContext<ApplicationUser> {

        public DbSet<Room> Rooms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=postgres-db;Database=kwizz;Username=kwizz;Password=kwizz;");
        }

    }
}