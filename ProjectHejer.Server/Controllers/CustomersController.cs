using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectHejer.Server.Data;
using ProjectHejer.Server.DTOs;
using ProjectHejer.Server.Models;

namespace ProjectHejer.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CustomersController> _logger;
        private const int MaxImagesPerCustomer = 10;

        public CustomersController(ApplicationDbContext context, ILogger<CustomersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Include(c => c.Images)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address,
                    CreatedDate = c.CreatedDate,
                    ImageCount = c.Images.Count
                })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Images)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                CreatedDate = customer.CreatedDate,
                ImageCount = customer.Images.Count
            };

            return Ok(customerDto);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto createCustomerDto)
        {
            var customer = new Customer
            {
                Name = createCustomerDto.Name,
                Email = createCustomerDto.Email,
                Phone = createCustomerDto.Phone,
                Address = createCustomerDto.Address
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var customerDto = new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                CreatedDate = customer.CreatedDate,
                ImageCount = 0
            };

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customerDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, CreateCustomerDto updateCustomerDto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.Name = updateCustomerDto.Name;
            customer.Email = updateCustomerDto.Email;
            customer.Phone = updateCustomerDto.Phone;
            customer.Address = updateCustomerDto.Address;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Image-related endpoints
        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<ImageDto>>> GetCustomerImages(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound("Customer not found");
            }

            var images = await _context.CustomerImages
                .Where(img => img.CustomerId == id)
                .Select(img => new ImageDto
                {
                    Id = img.Id,
                    ImageData = img.ImageData,
                    FileName = img.FileName,
                    ContentType = img.ContentType,
                    FileSize = img.FileSize,
                    UploadedDate = img.UploadedDate
                })
                .ToListAsync();

            return Ok(images);
        }

        [HttpPost("{id}/images")]
        public async Task<ActionResult<UploadImagesResponseDto>> UploadImages(int id, [FromBody] List<UploadImageDto> uploadImageDtos)
        {
            var customer = await _context.Customers
                .Include(c => c.Images)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound("Customer not found");
            }

            var currentImageCount = customer.Images.Count;
            var remainingSlots = MaxImagesPerCustomer - currentImageCount;

            if (remainingSlots <= 0)
            {
                return BadRequest(new UploadImagesResponseDto
                {
                    Success = false,
                    Message = $"Customer already has the maximum of {MaxImagesPerCustomer} images",
                    TotalImages = currentImageCount,
                    RemainingSlots = 0
                });
            }

            if (uploadImageDtos.Count > remainingSlots)
            {
                return BadRequest(new UploadImagesResponseDto
                {
                    Success = false,
                    Message = $"Cannot upload {uploadImageDtos.Count} images. Only {remainingSlots} slots remaining",
                    TotalImages = currentImageCount,
                    RemainingSlots = remainingSlots
                });
            }

            var uploadedImages = new List<ImageDto>();

            foreach (var uploadDto in uploadImageDtos)
            {
                // Validate Base64 format
                if (string.IsNullOrEmpty(uploadDto.ImageData))
                {
                    continue;
                }

                try
                {
                    // Validate base64 by trying to convert it
                    Convert.FromBase64String(uploadDto.ImageData);
                }
                catch
                {
                    continue; // Skip invalid base64 data
                }

                var customerImage = new CustomerImage
                {
                    CustomerId = id,
                    ImageData = uploadDto.ImageData,
                    FileName = uploadDto.FileName,
                    ContentType = uploadDto.ContentType,
                    FileSize = uploadDto.ImageData.Length
                };

                _context.CustomerImages.Add(customerImage);
                await _context.SaveChangesAsync();

                uploadedImages.Add(new ImageDto
                {
                    Id = customerImage.Id,
                    ImageData = customerImage.ImageData,
                    FileName = customerImage.FileName,
                    ContentType = customerImage.ContentType,
                    FileSize = customerImage.FileSize,
                    UploadedDate = customerImage.UploadedDate
                });
            }

            var newTotalImages = currentImageCount + uploadedImages.Count;
            var newRemainingSlots = MaxImagesPerCustomer - newTotalImages;

            return Ok(new UploadImagesResponseDto
            {
                Success = true,
                Message = $"Successfully uploaded {uploadedImages.Count} image(s)",
                UploadedImages = uploadedImages,
                TotalImages = newTotalImages,
                RemainingSlots = newRemainingSlots
            });
        }

        [HttpDelete("{id}/images/{imageId}")]
        public async Task<IActionResult> DeleteCustomerImage(int id, int imageId)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound("Customer not found");
            }

            var image = await _context.CustomerImages
                .FirstOrDefaultAsync(img => img.Id == imageId && img.CustomerId == id);

            if (image == null)
            {
                return NotFound("Image not found");
            }

            _context.CustomerImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}