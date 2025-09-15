namespace ProjectHejer.Server.DTOs
{
    public class LeadDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Company { get; set; }
        public string? Source { get; set; }
        public string Status { get; set; } = "New";
        public DateTime CreatedDate { get; set; }
        public int ImageCount { get; set; }
    }

    public class CreateLeadDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Company { get; set; }
        public string? Source { get; set; }
        public string Status { get; set; } = "New";
    }
}