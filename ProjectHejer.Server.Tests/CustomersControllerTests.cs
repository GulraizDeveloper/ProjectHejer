using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using ProjectHejer.Server.Data;
using ProjectHejer.Server.DTOs;
using System.Text;
using System.Text.Json;
using Xunit;

namespace ProjectHejer.Server.Tests
{
    public class CustomersControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public CustomersControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task GetCustomers_ReturnsEmptyList_WhenNoCustomers()
        {
            // Act
            var response = await _client.GetAsync("/api/customers");

            // Assert
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var customers = JsonSerializer.Deserialize<CustomerDto[]>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            Assert.NotNull(customers);
            Assert.Empty(customers);
        }

        [Fact]
        public async Task CreateCustomer_ReturnsCreatedCustomer()
        {
            // Arrange
            var newCustomer = new CreateCustomerDto
            {
                Name = "Test Customer",
                Email = "test@example.com",
                Phone = "123-456-7890",
                Address = "123 Test Street"
            };

            var json = JsonSerializer.Serialize(newCustomer);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/customers", content);

            // Assert
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var customer = JsonSerializer.Deserialize<CustomerDto>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(customer);
            Assert.Equal("Test Customer", customer.Name);
            Assert.Equal("test@example.com", customer.Email);
            Assert.Equal(0, customer.ImageCount);
        }

        [Fact]
        public async Task UploadImages_EnforcesImageLimit()
        {
            // First create a customer
            var newCustomer = new CreateCustomerDto
            {
                Name = "Test Customer for Images"
            };

            var customerJson = JsonSerializer.Serialize(newCustomer);
            var customerContent = new StringContent(customerJson, Encoding.UTF8, "application/json");
            var customerResponse = await _client.PostAsync("/api/customers", customerContent);
            customerResponse.EnsureSuccessStatusCode();

            var customerResponseContent = await customerResponse.Content.ReadAsStringAsync();
            var customer = JsonSerializer.Deserialize<CustomerDto>(customerResponseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Try to upload 11 images (should fail)
            var images = new List<UploadImageDto>();
            for (int i = 0; i < 11; i++)
            {
                images.Add(new UploadImageDto
                {
                    ImageData = Convert.ToBase64String(Encoding.UTF8.GetBytes($"fake-image-data-{i}")),
                    FileName = $"test-image-{i}.jpg",
                    ContentType = "image/jpeg"
                });
            }

            var imagesJson = JsonSerializer.Serialize(images);
            var imagesContent = new StringContent(imagesJson, Encoding.UTF8, "application/json");

            // Act
            var uploadResponse = await _client.PostAsync($"/api/customers/{customer!.Id}/images", imagesContent);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, uploadResponse.StatusCode);
            var uploadResponseContent = await uploadResponse.Content.ReadAsStringAsync();
            Assert.Contains("Only 10 slots remaining", uploadResponseContent);
        }
    }
}