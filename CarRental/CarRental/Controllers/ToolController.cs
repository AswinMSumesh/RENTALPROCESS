using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using CarRental.DTO.DBmodels;

namespace CarRental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToolController : ControllerBase
    {
        private readonly UserContext _context;

        public ToolController(UserContext context)
        {
            _context = context;
        }

        // Add Tool
        [HttpPost("addtool")]
        public async Task<IActionResult> AddTool([FromBody] Tool tool)
        {
            if (tool == null)
            {
                return BadRequest("Tool is null.");
            }

            _context.Tools.Add(tool);
            await _context.SaveChangesAsync();
            return Ok(tool);
        }

        // Delete Tool by ID
        [HttpDelete("deletetool")]
        public async Task<IActionResult> DeleteTool(int id)
        {
            var tool = await _context.Tools.FindAsync(id);
            if (tool == null)
            {
                return NotFound();
            }

            _context.Tools.Remove(tool);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Update Tool Status
        [HttpPut("changetoolstatus")]
        public async Task<IActionResult> UpdateToolStatus(int id, [FromBody] int status)
        {
            var tool = await _context.Tools.FindAsync(id);
            if (tool == null)
            {
                return NotFound();
            }

            tool.Status = status;
            _context.Tools.Update(tool);
            await _context.SaveChangesAsync();
            return Ok(tool);
        }

        // Get All Tools
        [HttpGet("allTools")]
        public async Task<IActionResult> GetAllTools()
        {
            var tools = await _context.Tools
                .Select(tool => new ToolDTO
                {
                    Id = tool.Id,
                    Name = tool.Name,
                    Rate = tool.Rate
                })
                .ToListAsync();

            return Ok(tools);
        }


        // Get Tools with Status 1
        [HttpGet("livetools")]
        public async Task<IActionResult> GetToolsWithStatus1()
        {
            var tools = await _context.Tools
                .Where(t => t.Status == 1)
                .Select(tool => new ToolDTO
                {
                    Id = tool.Id,
                    Name = tool.Name,
                    Rate = tool.Rate
                })
                .ToListAsync();

            return Ok(tools);
        }


        // Get Tools with Status 2
        [HttpGet("rentedtools")]
        public async Task<IActionResult> GetToolsWithStatus2()
        {
            var tools = await _context.Tools.Where(t => t.Status == 2).ToListAsync();
            return Ok(tools);
        }

        [HttpPost("booktool")]
        public async Task<IActionResult> BookTool([FromBody] RentTool rentTool)
        {
            if (rentTool == null)
            {
                return BadRequest("RentTool is null.");
            }

            rentTool.BookingDate = DateTime.Now;
            _context.RentTools.Add(rentTool);
            await _context.SaveChangesAsync();
            return Ok(rentTool);
        }


        [HttpGet("userPageToolBookingReport")]
        public async Task<IActionResult> GetBookingDetails(int userId)
        {
            var bookingDetails = await _context.RentTools
                .Where(rt => rt.UserId == userId)
                .Select(rt => new RentToolDTO
                {
                    Id = rt.Id,
                    UserId = rt.UserId,
                    ToolId = rt.ToolId,
                    FromDate = rt.FromDate,
                    ToDate = rt.ToDate,
                    Payment = rt.Payment,
                    PhoneNumber = rt.PhoneNumber,
                    Aadhar = rt.Aadhar,
                    BookingDate = rt.BookingDate
                })
                .ToListAsync();

            if (bookingDetails.Count == 0)
            {
                return NotFound("No booking details found for this user.");
            }

            var user = await _context.Users.FindAsync(userId);
            var result = new
            {
                User = user,
                BookingDetails = bookingDetails
            };

            return Ok(result);
        }





        [HttpGet("allUsersToolBookingReport")]
        public async Task<IActionResult> GetAllBookingDetails()
        {
            var bookingDetails = await _context.RentTools
                .Select(rt => new
                {
                    RentTool = rt,
                    User = _context.Users.FirstOrDefault(u => u.Id == rt.UserId)
                })
                .ToListAsync();

            var result = bookingDetails
                .Where(bd => bd.User != null)
                .GroupBy(bd => bd.User)
                .Select(group => new
                {
                    User = group.Key,
                    BookingDetails = group.Select(bd => new RentToolDTO
                    {
                        Id = bd.RentTool.Id,
                        UserId = bd.RentTool.UserId,
                        ToolId = bd.RentTool.ToolId,
                        FromDate = bd.RentTool.FromDate,
                        ToDate = bd.RentTool.ToDate,
                        Payment = bd.RentTool.Payment,
                        PhoneNumber = bd.RentTool.PhoneNumber,
                        Aadhar = bd.RentTool.Aadhar,
                        BookingDate = bd.RentTool.BookingDate
                    }).ToList()
                })
                .ToList();

            return Ok(result);
        }



    }
}
