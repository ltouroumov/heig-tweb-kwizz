using Microsoft.EntityFrameworkCore;

namespace KwizzApi.Models {
    public class KwizzContext : DbContext {
        public DbSet<Room> Rooms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=postgres-db;Database=kwizz;Username=kwizz;Password=kwizz;");
        }

    }
}