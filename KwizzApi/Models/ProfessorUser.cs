using System.ComponentModel.DataAnnotations;

namespace KwizzApi.Models
{
    public class ProfessorUser
    {
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }
    }
}