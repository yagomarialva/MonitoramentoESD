using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BiometricFaceApi.Models
{
    [Table("authentication")]
    [Index(nameof(Badge), IsUnique = true)]
    public class AuthenticationModel
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string? Username { get; set; }
        public string? RolesName { get; set; }
        public string? Badge { get; set; }
        public string? Password { get; set; }
        

    }
}
