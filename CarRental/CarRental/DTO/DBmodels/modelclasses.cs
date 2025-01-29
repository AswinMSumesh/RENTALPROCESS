using System.Text.Json.Serialization;

namespace CarRental.DTO.DBmodels
{
    public class User
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Type { get; set; }
    }


        public class Car
        {
        [JsonIgnore]
        public int Id { get; set; }
            public string CarName { get; set; }
            public string PlateNum { get; set; }
            public int RegYear { get; set; }
            public string Color { get; set; }
            public int Mileage { get; set; }
            public int Seats { get; set; }
            public string EngineType { get; set; }
            public decimal Rate { get; set; }
        [JsonIgnore]
        public int Status { get; set; } = 1;
        public string Image { get; set; } // Base64 string for car image
    }


    public class Renting
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CarId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public decimal Payment { get; set; }
        public string PhoneNumber { get; set; }
        public string Aadhar { get; set; }
        public DateTime BookingDate { get; set; }
    }


    public class Tool
    {
        [JsonIgnore]
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Rate { get; set; }
        [JsonIgnore]
        public int Status { get; set; } = 1;
    }


    public class RentTool
    {
        [JsonIgnore]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ToolId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public decimal Payment { get; set; }
        public string PhoneNumber { get; set; }
        public string Aadhar { get; set; }
        public DateTime BookingDate { get; set; }
    }


}
