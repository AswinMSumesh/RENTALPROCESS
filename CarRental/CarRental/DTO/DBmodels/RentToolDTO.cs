namespace CarRental.DTO.DBmodels
{
    public class RentToolDTO
    {
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
