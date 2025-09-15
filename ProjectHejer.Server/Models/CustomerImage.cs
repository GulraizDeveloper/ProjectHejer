using System.ComponentModel.DataAnnotations;

namespace ProjectHejer.Server.Models
{
    public class CustomerImage
    {
        public int Id { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        public string ImageData { get; set; } = string.Empty; // Base64 encoded image
        
        [StringLength(255)]
        public string? FileName { get; set; }
        
        [StringLength(50)]
        public string? ContentType { get; set; }
        
        public long FileSize { get; set; }
        
        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Customer Customer { get; set; } = null!;
    }
}