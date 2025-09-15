using System.ComponentModel.DataAnnotations;

namespace ProjectHejer.Server.Models
{
    public class LeadImage
    {
        public int Id { get; set; }
        
        [Required]
        public int LeadId { get; set; }
        
        [Required]
        public string ImageData { get; set; } = string.Empty; // Base64 encoded image
        
        [StringLength(255)]
        public string? FileName { get; set; }
        
        [StringLength(50)]
        public string? ContentType { get; set; }
        
        public long FileSize { get; set; }
        
        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Lead Lead { get; set; } = null!;
    }
}