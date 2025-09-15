namespace ProjectHejer.Server.DTOs
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ImageCount { get; set; }
    }

    public class CreateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}