namespace BE.Data
{
    using Microsoft.EntityFrameworkCore;
    using BE.Models;

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }

    

}
