namespace ProjectHejer.Server.DTOs
{
    public class ImageDto
    {
        public int Id { get; set; }
        public string ImageData { get; set; } = string.Empty;
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedDate { get; set; }
    }

    public class UploadImageDto
    {
        public string ImageData { get; set; } = string.Empty; // Base64 encoded
        public string? FileName { get; set; }
        public string? ContentType { get; set; }
    }

    public class UploadImagesResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<ImageDto> UploadedImages { get; set; } = new();
        public int TotalImages { get; set; }
        public int RemainingSlots { get; set; }
    }
}