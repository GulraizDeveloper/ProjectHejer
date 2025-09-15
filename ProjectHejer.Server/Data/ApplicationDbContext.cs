using Microsoft.EntityFrameworkCore;
using ProjectHejer.Server.Models;

namespace ProjectHejer.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Lead> Leads { get; set; }
        public DbSet<CustomerImage> CustomerImages { get; set; }
        public DbSet<LeadImage> LeadImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Customer entity
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Address).HasMaxLength(500);
            });

            // Configure Lead entity
            modelBuilder.Entity<Lead>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Company).HasMaxLength(100);
                entity.Property(e => e.Source).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(20);
            });

            // Configure CustomerImage entity
            modelBuilder.Entity<CustomerImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageData).IsRequired();
                entity.Property(e => e.FileName).HasMaxLength(255);
                entity.Property(e => e.ContentType).HasMaxLength(50);
                
                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.Images)
                    .HasForeignKey(e => e.CustomerId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure LeadImage entity
            modelBuilder.Entity<LeadImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ImageData).IsRequired();
                entity.Property(e => e.FileName).HasMaxLength(255);
                entity.Property(e => e.ContentType).HasMaxLength(50);
                
                entity.HasOne(e => e.Lead)
                    .WithMany(l => l.Images)
                    .HasForeignKey(e => e.LeadId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}