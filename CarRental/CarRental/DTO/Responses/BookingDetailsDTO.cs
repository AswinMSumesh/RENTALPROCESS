namespace CarRental.DTO.Responses
{
    public class BookingDetailsDTO
    {
        public int RentId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public int CarId { get; set; }
        public string CarName { get; set; }
        public string PlateNum { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public decimal Payment { get; set; }
        public DateTime BookingDate { get; set; }
        public string Aadhar { get; set; }
        public string PhoneNumber { get; set; }


    }
}
