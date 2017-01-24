using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace KwizzApi.Models
{
    public class KwizzContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomInfo> RoomInfos { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Option> Options { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=postgres-db;Database=kwizz;Username=kwizz;Password=kwizz;");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserAnswer>()
                .HasKey(t => new { t.OptionId, t.UserId });

            modelBuilder.Entity<UserAnswer>()
                .HasOne(t => t.Option)
                .WithMany(t => t.Answers);

            modelBuilder.Entity<UserAnswer>()
                .HasOne(t => t.User)
                .WithMany(t => t.Answers);
        }

    }
}