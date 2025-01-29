using Microsoft.AspNetCore.Mvc;
using CarRental.DTO.DBmodels;
using CarRental.DTO.Responses;

namespace CarRental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentingController : ControllerBase
    {
        private readonly UserContext _context;

        public RentingController(UserContext context)
        {
            _context = context;
        }

        [HttpPost("rentCar")]
        public IActionResult BookCar(Renting renting)
        {
            renting.BookingDate = DateTime.Now; // Set current date as BookingDate
            _context.RentingTable.Add(renting);

            // Find the car by CarId and update its status
            var car = _context.Cars.FirstOrDefault(c => c.Id == renting.CarId);
            if (car != null)
            {
                car.Status = 2;
                _context.Cars.Update(car);
            }

            _context.SaveChanges();
            return Ok("Car booked successfully.");
        }

        [HttpGet("userViewTheirRentings")]
        public ActionResult<BookingDetailsDTO> GetBookingDetails(int userId)
        {
            var booking = _context.RentingTable
                .Where(r => r.UserId == userId)
                .Select(r => new BookingDetailsDTO
                {
                    RentId = r.Id,
                    UserId = r.UserId,
                    Username = _context.Users.FirstOrDefault(u => u.Id == r.UserId).Username,
                    Email = _context.Users.FirstOrDefault(u => u.Id == r.UserId).Email,
                    CarId = r.CarId,
                    CarName = _context.Cars.FirstOrDefault(c => c.Id == r.CarId).CarName,
                    PlateNum = _context.Cars.FirstOrDefault(c => c.Id == r.CarId).PlateNum,
                    FromDate = r.FromDate,
                    ToDate = r.ToDate,
                    Payment = r.Payment,
                    BookingDate = r.BookingDate
                }).FirstOrDefault();

            if (booking == null)
            {
                return NotFound("Booking details not found.");
            }

            return Ok(booking);
        }

        [HttpGet("adminViewAllRentings")]
        public ActionResult<IEnumerable<BookingDetailsDTO>> GetAllBookingDetails()
        {
            var bookings = _context.RentingTable
                .Select(r => new BookingDetailsDTO
                {
                    RentId = r.Id,
                    UserId = r.UserId,
                    Username = _context.Users.FirstOrDefault(u => u.Id == r.UserId).Username,
                    Email = _context.Users.FirstOrDefault(u => u.Id == r.UserId).Email,
                    CarId = r.CarId,
                    CarName = _context.Cars.FirstOrDefault(c => c.Id == r.CarId).CarName,
                    PlateNum = _context.Cars.FirstOrDefault(c => c.Id == r.CarId).PlateNum,
                    FromDate = r.FromDate,
                    ToDate = r.ToDate,
                    Payment = r.Payment,
                    BookingDate = r.BookingDate,
                    PhoneNumber = r.PhoneNumber,
                    Aadhar=r.Aadhar
                }).ToList();

            return Ok(bookings);
        }










    }
}
