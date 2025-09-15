using System.ComponentModel.DataAnnotations;

namespace ProjectHejer.Server.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [EmailAddress]
        public string? Email { get; set; }
        
        [Phone]
        public string? Phone { get; set; }
        
        public string? Address { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property for images
        public virtual ICollection<CustomerImage> Images { get; set; } = new List<CustomerImage>();
    }
}