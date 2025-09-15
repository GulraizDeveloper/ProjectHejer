using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectHejer.Server.Data;
using ProjectHejer.Server.DTOs;
using ProjectHejer.Server.Models;

namespace ProjectHejer.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeadsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<LeadsController> _logger;
        private const int MaxImagesPerLead = 10;

        public LeadsController(ApplicationDbContext context, ILogger<LeadsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeadDto>>> GetLeads()
        {
            var leads = await _context.Leads
                .Include(l => l.Images)
                .Select(l => new LeadDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Email = l.Email,
                    Phone = l.Phone,
                    Company = l.Company,
                    Source = l.Source,
                    Status = l.Status,
                    CreatedDate = l.CreatedDate,
                    ImageCount = l.Images.Count
                })
                .ToListAsync();

            return Ok(leads);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LeadDto>> GetLead(int id)
        {
            var lead = await _context.Leads
                .Include(l => l.Images)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lead == null)
            {
                return NotFound();
            }

            var leadDto = new LeadDto
            {
                Id = lead.Id,
                Name = lead.Name,
                Email = lead.Email,
                Phone = lead.Phone,
                Company = lead.Company,
                Source = lead.Source,
                Status = lead.Status,
                CreatedDate = lead.CreatedDate,
                ImageCount = lead.Images.Count
            };

            return Ok(leadDto);
        }

        [HttpPost]
        public async Task<ActionResult<LeadDto>> CreateLead(CreateLeadDto createLeadDto)
        {
            var lead = new Lead
            {
                Name = createLeadDto.Name,
                Email = createLeadDto.Email,
                Phone = createLeadDto.Phone,
                Company = createLeadDto.Company,
                Source = createLeadDto.Source,
                Status = createLeadDto.Status
            };

            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            var leadDto = new LeadDto
            {
                Id = lead.Id,
                Name = lead.Name,
                Email = lead.Email,
                Phone = lead.Phone,
                Company = lead.Company,
                Source = lead.Source,
                Status = lead.Status,
                CreatedDate = lead.CreatedDate,
                ImageCount = 0
            };

            return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, leadDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLead(int id, CreateLeadDto updateLeadDto)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            lead.Name = updateLeadDto.Name;
            lead.Email = updateLeadDto.Email;
            lead.Phone = updateLeadDto.Phone;
            lead.Company = updateLeadDto.Company;
            lead.Source = updateLeadDto.Source;
            lead.Status = updateLeadDto.Status;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLead(int id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound();
            }

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Image-related endpoints
        [HttpGet("{id}/images")]
        public async Task<ActionResult<IEnumerable<ImageDto>>> GetLeadImages(int id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound("Lead not found");
            }

            var images = await _context.LeadImages
                .Where(img => img.LeadId == id)
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
            var lead = await _context.Leads
                .Include(l => l.Images)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lead == null)
            {
                return NotFound("Lead not found");
            }

            var currentImageCount = lead.Images.Count;
            var remainingSlots = MaxImagesPerLead - currentImageCount;

            if (remainingSlots <= 0)
            {
                return BadRequest(new UploadImagesResponseDto
                {
                    Success = false,
                    Message = $"Lead already has the maximum of {MaxImagesPerLead} images",
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

                var leadImage = new LeadImage
                {
                    LeadId = id,
                    ImageData = uploadDto.ImageData,
                    FileName = uploadDto.FileName,
                    ContentType = uploadDto.ContentType,
                    FileSize = uploadDto.ImageData.Length
                };

                _context.LeadImages.Add(leadImage);
                await _context.SaveChangesAsync();

                uploadedImages.Add(new ImageDto
                {
                    Id = leadImage.Id,
                    ImageData = leadImage.ImageData,
                    FileName = leadImage.FileName,
                    ContentType = leadImage.ContentType,
                    FileSize = leadImage.FileSize,
                    UploadedDate = leadImage.UploadedDate
                });
            }

            var newTotalImages = currentImageCount + uploadedImages.Count;
            var newRemainingSlots = MaxImagesPerLead - newTotalImages;

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
        public async Task<IActionResult> DeleteLeadImage(int id, int imageId)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null)
            {
                return NotFound("Lead not found");
            }

            var image = await _context.LeadImages
                .FirstOrDefaultAsync(img => img.Id == imageId && img.LeadId == id);

            if (image == null)
            {
                return NotFound("Image not found");
            }

            _context.LeadImages.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}