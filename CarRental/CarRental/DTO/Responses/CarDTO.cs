namespace CarRental.DTO.Responses
{
    public class CarDTO
    {
        public int Id { get; set; }
        public string CarName { get; set; }
        public string PlateNum { get; set; }
        public int RegYear { get; set; }
        public string Color { get; set; }
        public int Mileage { get; set; }
        public int Seats { get; set; }
        public string EngineType { get; set; }
        public decimal Rate { get; set; }
        public int Status { get; set; }
        public string Image { get; set; }
    }
}
