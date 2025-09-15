using System.ComponentModel.DataAnnotations;

namespace ProjectHejer.Server.Models
{
    public class Lead
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [EmailAddress]
        public string? Email { get; set; }
        
        [Phone]
        public string? Phone { get; set; }
        
        public string? Company { get; set; }
        
        public string? Source { get; set; }
        
        public string Status { get; set; } = "New"; // New, Contacted, Qualified, Converted, Lost
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property for images
        public virtual ICollection<LeadImage> Images { get; set; } = new List<LeadImage>();
    }
}