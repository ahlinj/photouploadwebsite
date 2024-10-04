using System.ComponentModel.DataAnnotations.Schema;

namespace BE.Models
{
    public class User
    {
        [Column("id")]
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
