using Microsoft.EntityFrameworkCore;
using CarRental.DTO.DBmodels;

namespace CarRental
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Renting> RentingTable { get; set; }
        public DbSet<Tool> Tools { get; set; }
        public DbSet<RentTool> RentTools { get; set; }


    }



}
