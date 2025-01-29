using Microsoft.AspNetCore.Mvc;
using CarRental.DTO.DBmodels;
using CarRental.DTO.Responses;

namespace CarRental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly UserContext _context;

        public CarController(UserContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public IActionResult AddCar(Car car)
        {
            car.Status = 1; // Default status
            _context.Cars.Add(car);
            _context.SaveChanges();
            return Ok("Car added successfully.");
        }

        [HttpDelete("delete")]
        public IActionResult DeleteCar(int id)
        {
            var car = _context.Cars.Find(id);
            if (car == null)
            {
                return NotFound("Car not found.");
            }

            _context.Cars.Remove(car);
            _context.SaveChanges();
            return Ok("Car deleted successfully.");
        }

        [HttpPut("updateStatus")]
        public IActionResult UpdateCarStatus(int id, int status)
        {
            var car = _context.Cars.Find(id);
            if (car == null)
            {
                return NotFound("Car not found.");
            }

            car.Status = status;
            _context.SaveChanges();
            return Ok("Car status updated successfully.");
        }


        [HttpGet("allCars")]
        public ActionResult<IEnumerable<CarDTO>> GetAllCars()
        {
            var cars = _context.Cars.Select(car => new CarDTO
            {
                Id = car.Id,
                CarName = car.CarName,
                PlateNum = car.PlateNum,
                RegYear = car.RegYear,
                Color = car.Color,
                Mileage = car.Mileage,
                Seats = car.Seats,
                EngineType = car.EngineType,
                Rate = car.Rate,
                Status = car.Status,
                Image = car.Image
            }).ToList();

            return Ok(cars);
        }

        [HttpGet("instockCars")]
        public ActionResult<IEnumerable<CarDTO>> GetCarsWithStatus1()
        {
            var cars = _context.Cars
                .Where(car => car.Status == 1)
                .Select(car => new CarDTO
                {
                    Id = car.Id,
                    CarName = car.CarName,
                    PlateNum = car.PlateNum,
                    RegYear = car.RegYear,
                    Color = car.Color,
                    Mileage = car.Mileage,
                    Seats = car.Seats,
                    EngineType = car.EngineType,
                    Rate = car.Rate,
                    Status = car.Status,
                    Image = car.Image
                }).ToList();

            return Ok(cars);
        }

        [HttpGet("rentedCars")]
        public ActionResult<IEnumerable<CarDTO>> GetCarsWithStatus2()
        {
            var cars = _context.Cars
                .Where(car => car.Status == 2)
                .Select(car => new CarDTO
                {
                    Id = car.Id,
                    CarName = car.CarName,
                    PlateNum = car.PlateNum,
                    RegYear = car.RegYear,
                    Color = car.Color,
                    Mileage = car.Mileage,
                    Seats = car.Seats,
                    EngineType = car.EngineType,
                    Rate = car.Rate,
                    Status = car.Status,
                    Image = car.Image
                }).ToList();

            return Ok(cars);
        }








    }
}
